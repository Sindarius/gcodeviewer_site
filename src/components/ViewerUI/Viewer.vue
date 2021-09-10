<template>
    <div>
        <canvas class="canvas-sizing" ref="viewercanvas" />
        <v-progress-linear v-show="showProgress" class="progress-position disable-transition" striped height="30" rounded :value="progressPercent">
            <template v-slot:default="{ value }">
                <strong class="progress-text">{{ Math.ceil(value) }}% {{ message }} </strong>
            </template>
        </v-progress-linear>
        <div class="scrubber" v-show="!liveTracking && scrubFileSize > 0">
            <v-row dense>
                <v-col cols="9" md="7">
                    <v-slider :hint="scrubPosition + '/' + scrubFileSize" :max="scrubFileSize" dense min="0" persistent-hint v-model="scrubPosition"></v-slider>
                </v-col>
                <v-col cols="3" md="2">
                    <v-btn @click="scrubPlaying = !scrubPlaying">
                        <v-icon v-if="scrubPlaying">mdi-stop</v-icon>
                        <v-icon v-else>mdi-play</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols="12" md="2">
                    <v-btn-toggle dense mandatory rounded v-model="scrubSpeed">
                        <v-btn :value="1">1x</v-btn>
                        <v-btn :value="2">2x</v-btn>
                        <v-btn :value="5">5x</v-btn>
                        <v-btn :value="10">10x</v-btn>
                        <v-btn :value="20">20x</v-btn>
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
</style>

<script lang="ts">
// @ts-ignore
import GCodeViewer from '@sindarius/gcodeviewer'
import { Component, Ref, Watch, Mixins } from 'vue-property-decorator'
import ViewerMixin from '@/components/mixin/ViewerMixin'
import { BuildVolume, PrinterStateMotion } from '@/store/printer/types'
import { Viewer as ViewerState } from '@/store/viewer/types'
import axios from 'axios'

let viewer!: any

@Component
export default class Viewer extends Mixins(ViewerMixin) {
    @Ref('viewercanvas') viewercanvas!: HTMLCanvasElement
    progressPercent = 0
    message = ''
    scrubPosition = 0
    scrubPlaying = false
    scrubSpeed = 1
    scrubInterval = -1
    scrubFileSize = 0

    mounted(): void {
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

        //initialize
        if (viewer) return
        viewer = new GCodeViewer(this.viewercanvas)
        this.setGCodeViewer(viewer)
        viewer.init()
        viewer.setCursorVisiblity(true)
        window.onresize = () => {
            viewer.resize()
        }

        viewer.gcodeProcessor.loadingProgressCallback = this.updatePercent

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
            viewer.gcodeProcessor.updateFilePosition(to)
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
        for (var axesIdx in to) {
            let axes = to[axesIdx]
            if ('XYZ'.includes(axes.axes)) {
                var letter = axes.axes.toLowerCase()
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
            let file = await this.download(this.currentJob, this.updatePercent)
            if (file) {
                this.progressPercent = 0
                this.beforeRender()
                await viewer.processFile(file)
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
        let response = await axios.get('./benchy_color.gcode', {
            onDownloadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100
                this.updatePercent(percentCompleted, `Downloading Benchy`)
            }
        })
        let result = response.data
        this.scrubFileSize = result.length
        viewer.gcodeProcessor.updateFilePosition(result.length)
        this.beforeRender()
        await viewer.processFile(result)
        this.showProgress = false
    }

    async openLocalFile(file: File): Promise<void> {
        if (!file) return
        const reader = new FileReader()
        this.showProgress = true
        this.currentFileName = `${file.name}`
        reader.addEventListener('load', async (event) => {
            const blob = event?.target?.result
            this.beforeRender()
            await viewer.processFile(blob)
            this.scrubFileSize = viewer.fileSize
            this.showProgress = false
        })
        reader.readAsText(file)
    }

    disconnect(): void {
        this.liveTracking = false
        viewer.clearScene(true)
    }

    @Watch('scrubPosition') scrubPositionChanged(to: number): void {
        if (!this.liveTracking) {
            viewer.gcodeProcessor.updateFilePosition(to)
        }
    }

    @Watch('scrubPlaying') scrubPlayingChanaged(to: boolean): void {
        if (to) {
            ViewerMixin.scrubPlaying = true
            viewer.gcodeProcessor.updateFilePosition(this.scrubPosition - 30000)
            this.scrubInterval = setInterval(() => {
                this.scrubPosition += 100 * this.scrubSpeed
                viewer.gcodeProcessor.updateFilePosition(this.scrubPosition)
            }, 200)
        } else {
            if (this.scrubInterval > -1) {
                clearInterval(this.scrubInterval)
            }
            ViewerMixin.scrubPlaying = false
            this.scrubInterval = -1
        }
    }
}
</script>
