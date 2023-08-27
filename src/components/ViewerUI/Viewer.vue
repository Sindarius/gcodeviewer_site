<template>
    <div>
        <div class="codestream" v-show="showGCodeStream">
            <CodeStream :currentline.sync="scrubPosition" :document="fileData" @got-focus="resetFocus" :shown="showGCodeStream" @updated="codeStreamUpdate"></CodeStream>
        </div>
        <canvas :class="showGCodeStream ? 'canvas-sizing-codestream' : 'canvas-sizing'" ref="viewercanvas" @dragover.prevent="dragOver" @dragleave="dragLeave" @drop.prevent="drop" />
        <v-progress-linear v-show="showProgress" class="progress-position disable-transition" striped height="30" rounded :value="progressPercent">
            <template v-slot:default="{ value }">
                <strong class="progress-text">{{ Math.ceil(value) }}% {{ message }} </strong>
            </template>
        </v-progress-linear>
        <div :class="showGCodeStream ? 'scrubber-codestream' : 'scrubber'" v-show="!liveTracking && scrubFileSize > 0">
            <v-row dense>
                <v-col cols="9" md="7">
                    <v-slider :hint="scrubPosition + '/' + scrubFileSize" :max="scrubFileSize" dense min="0" persistent-hint v-model="scrubPosition" @start="scrubStart" @end="scrubEnd" @change="scrubPositionChanged"></v-slider>
                </v-col>
                <v-col cols="3" md="2">
                    <v-btn ref="playButton" @click="simulatePlay">
                        <v-icon v-if="scrubPlaying">mdi-stop</v-icon>
                        <v-icon v-else>mdi-play</v-icon>
                    </v-btn>
                    <v-btn @click="fastForward">
                        <v-icon>mdi-fast-forward</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="12" md="2">
                    <v-btn-toggle dense mandatory rounded v-model="scrubSpeed">
                        <v-btn :value="1">1x</v-btn>
                        <v-btn :value="2">2x</v-btn>
                        <v-btn :value="5">5x</v-btn>
                        <v-btn :value="10">10x</v-btn>
                        <v-btn :value="20">20x</v-btn>
                        <v-btn :value="100">100x</v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<style scoped lang="scss">
.canvas-sizing {
    position: fixed;
    top: 47px;
    left: 0;
    width: 100%;
    height: calc(100% - 47px);
}

.canvas-sizing-codestream {
    position: fixed;
    top: 47px;
    left: 0;
    width: 70%;
    height: calc(100% - 47px);
}

.codestream {
    position: fixed;
    top: 47px;
    left: 70%;
    width: 30%;
    height: calc(100% - 47px);
}

.progress-position {
    position: absolute;
    bottom: 100px;
    left: 50px;
    width: calc(100% - 100px);
}
.progress-text {
    color: white;
}
/* Transitions lag when trying to show loading progress */
.disable-transition {
    transition: none !important;
}

.scrubber {
    position: fixed;
    left: 5%;
    right: 5%;
    bottom: 5px;
    z-index: 19 !important;
}
.scrubber-codestream {
    position: fixed;
    left: 5%;
    right: 35%;
    bottom: 5px;
    z-index: 19 !important;
}
.gcode-lines {
    position: fixed;
    left: 10px;
    top: 100px;
    width: 400px;
    max-height: 200px;
    overflow: auto;
    z-index: 19;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
}
</style>

<script lang="ts">
// @ts-ignore
import GCodeViewer from '@sindarius/gcodeviewer'
import { Component, Ref, Watch, Mixins } from 'vue-property-decorator'
import ViewerMixin from '@/components/mixin/ViewerMixin'
import { BuildVolume, PrinterStateMotion } from '@/store/printer/types'
import { Viewer as ViewerState } from '@/store/viewer/types'
import axios from 'axios'
import CodeStream from './CodeStream.vue'
import { watch } from 'vue'

let viewer!: any

@Component({
    components: {
        CodeStream
    }
})
export default class Viewer extends Mixins(ViewerMixin) {
    @Ref('viewercanvas') viewercanvas!: HTMLCanvasElement
    @Ref('playButton') playButton!: any
    progressPercent = 0
    message = ''
    scrubPosition = 0
    scrubPlaying = false
    scrubSpeed = 1
    scrubInterval = -1
    scrubFileSize = 0
    gcodeLines = ''
    fileData = ''
    gcodeLineNumber = 0

    async mounted(): Promise<void> {
        //register events
        this.$eventHub.$on('trackCurrentJob', () => {
            this.trackCurrentJob()
        })

        this.$eventHub.$on('disconnect', () => {
            this.disconnect()
        })

        this.$eventHub.$on('openLocalFile', async (file: File) => {
            await this.openLocalFile(file)
        })

        this.$eventHub.$on('LoadBenchy', async () => {
            await this.OpenBenchy()
        })

        this.$eventHub.$on('reloadComplete', () => {
            if (this.scrubFileSize > 0 && !this.scrubPlaying) {
                viewer.gcodeProcessor.updateFilePosition(this.scrubPosition)
                this.gcodeLines = viewer.getGCodeLine()
                this.gcodeLineNumber = viewer.getGCodeLineNumber()
            }
        })

        //initialize
        if (viewer) return
        viewer = new GCodeViewer(this.viewercanvas)
        this.setGCodeViewer(viewer)
        await viewer.init()
        viewer.setCursorVisiblity(true)
        window.onresize = () => {
            viewer.resize()
        }

        viewer.gcodeProcessor.loadingProgressCallback = this.updatePercent
        viewer.gcodeProcessor.g1AsExtrusion = this.g1AsExtrusion
        this.beforeRender()

        viewer.simulationUpdatePosition = (position: number) => {
            this.scrubPosition = position - 2
        }
        viewer.simulationStopped = () => {
            this.scrubPlaying = false
        }

        if (viewer.lastLoadFailed()) {
            this.renderQuality = 1
            viewer.clearLoadFlag()
        }
    }

    beforeDestroy(): void {
        this.$eventHub.$off('trackCurrentJob')
        this.$eventHub.$off('disconnect')
        this.$eventHub.$off('openLocalFile')
        this.$eventHub.$off('LoadBenchy')
        this.$eventHub.$off('reloadComplete')
    }

    get cursorPosition(): PrinterStateMotion {
        return this.$store.state.printer.motion
    }

    get buildVolume(): BuildVolume[] {
        return this.$store.state.printer.buildVolume
    }

    get currentJob(): string | null {
        return this.$store.state.printer.job.fileName
    }

    get currentFilePosition(): number {
        return this.$store.state.printer.job?.filePosition ?? 0
    }

    @Watch('currentFilePosition')
    currentFilePositionUpdated(to: number): void {
        if (this.liveTracking) {
            viewer.gcodeProcessor.updateFilePosition(to - this.fileOffset)
            this.gcodeLines = viewer.getGCodeLine()
            this.gcodeLineNumber = viewer.getGCodeLineNumber()
        }
    }

    get viewerState(): ViewerState {
        return this.$store.state.viewer
    }

    @Watch('cursorPosition')
    cursorPositionChanged(to: PrinterStateMotion): void {
        viewer?.updateToolPosition(to)
    }

    @Watch('buildVolume', { deep: true })
    buildVolumeChanged(to: BuildVolume[]): void {
        for (const axesIdx in to) {
            const axes = to[axesIdx]
            if ('XYZ'.includes(axes.axes)) {
                const letter = axes.axes.toLowerCase()
                viewer.bed.buildVolume[letter].min = axes.min
                viewer.bed.buildVolume[letter].max = axes.max
            }
        }
        viewer.bed.commitBedSize()
        viewer.reload()
    }

    updatePercent(status: number, message: string): void {
        this.progressPercent = status * 100
        this.message = message
    }

    async trackCurrentJob(): Promise<void> {
        if (this.currentJob) {
            this.showProgress = true
            this.currentFileName = this.currentJob
            const file = await this.download(this.currentJob, this.updatePercent)
            if (file) {
                this.progressPercent = 0
                this.beforeRender()
                await viewer.processFile(file)
                this.fileData = viewer.fileData
                viewer.gcodeProcessor.forceRedraw()
                this.scrubFileSize = viewer.fileSize
                this.liveTracking = true
                this.showProgress = false
            }
            this.showProgress = false
        }
    }

    async OpenBenchy(): Promise<void> {
        this.showProgress = true
        this.currentFileName = 'benchy_color.gcode'
        const response = await axios.get('./benchy_color.gcode', {
            onDownloadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100
                this.updatePercent(percentCompleted, `Downloading Benchy`)
            }
        })
        const result = response.data
        this.scrubFileSize = result.length
        viewer.gcodeProcessor.updateFilePosition(result.length)
        this.beforeRender()
        await viewer.processFile(result)
        this.fileData = viewer.fileData
        this.showProgress = false
    }

    async openLocalFile(file: File): Promise<void> {
        if (!file) return
        this.unload()
        const reader = new FileReader()
        this.showProgress = true
        this.liveTracking = false
        this.currentFileName = `${file.name}`
        reader.addEventListener('load', async (event) => {
            const blob = event?.target?.result
            this.beforeRender()
            await viewer.processFile(blob)
            console.log(viewer.getLayers())
            this.fileData = viewer.fileData
            this.scrubFileSize = viewer.fileSize
            this.showProgress = false
        })
        reader.readAsText(file)
    }

    disconnect(): void {
        this.liveTracking = false
        viewer.clearScene(true)
    }

    fastForward(): void {
        viewer.stopSimulation()
        this.scrubPlaying = false
        this.scrubPosition = this.scrubFileSize
        viewer.gcodeProcessor.updateFilePosition(this.scrubFileSize)
        viewer.simulateToolPosition()
    }

    scrubStart() {
        viewer.simulation = false
    }

    scrubEnd() {
        viewer.simulation = this.scrubPlaying
    }

    scrubPositionChanged(value: number) {
        const viewerState = viewer.simulation
        viewer.simulation = false
        this.$nextTick(() => {
            this.scrubPosition = value
            viewer.gcodeProcessor.updateFilePosition(value)
            viewer.simulateToolPosition()
            viewer.simulation = viewerState
        })
    }

    @Watch('scrubSpeed')
    scrubSpeedChanged(value: number) {
        viewer.simulationMultiplier = value
    }

    simulatePlay() {
        if (this.scrubPlaying) {
            viewer.stopSimulation()
        } else {
            viewer.startSimulation()
        }
        this.scrubPlaying = viewer.simulation
    }

    dragOver(event: DragEvent): void {
        if ((event.dataTransfer?.files.length ?? -1) > 0) {
            //const  file = event.dataTransfer?.files[0]
        }
    }

    dragLeave(event: DragEvent): void {
        //Do nothing at the moment
    }

    async drop(event: DragEvent): Promise<void> {
        if ((event.dataTransfer?.files.length ?? -1) > 0) {
            const file = event.dataTransfer?.files[0]
            if (file) {
                await this.openLocalFile(file)
            }
        }
    }

    resetFocus(): void {
        const i = 0
    }

    codeStreamUpdate(value: number) {
        const viewerState = viewer.simulation
        viewer.simulation = false
        this.$nextTick(() => {
            this.scrubPosition = value
            viewer.gcodeProcessor.updateFilePosition(value)
            viewer.simulateToolPosition()
            viewer.simulation = viewerState
        })
    }
}
</script>
