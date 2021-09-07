<template>
    <div>
        <canvas class="canvas-sizing" ref="viewercanvas" />
        <v-progress-linear v-show="downloading" class="progress-position disable-transition" striped height="30" rounded :value="progressPercent">
            <template v-slot:default="{ value }">
                <strong class="progress-text">{{ Math.ceil(value) }}% {{ message }} </strong>
            </template>
        </v-progress-linear>
    </div>
</template>

<style scoped lang="scss">
.canvas-sizing {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.progress-position {
    position: absolute;
    bottom: 5px;
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
</style>

<script lang="ts">
// @ts-ignore
import GCodeViewer from '@sindarius/gcodeviewer'
import { Component, Ref, Watch, Mixins } from 'vue-property-decorator'
import ViewerMixin from '@/components/mixin/ViewerMixin'
import { BuildVolume, PrinterStateMotion } from '@/store/printer/types'
import { Viewer as ViewerState } from '@/store/viewer/types'

let viewer!: any

@Component
export default class Viewer extends Mixins(ViewerMixin) {
    @Ref('viewercanvas') viewercanvas!: HTMLCanvasElement
    trackJob = false
    downloading = false
    progressPercent = 0
    message = ''

    mounted(): void {
        //register events
        this.$eventHub.$on('trackCurrentJob', () => {
            this.trackCurrentJob()
        })

        this.$eventHub.$on('disconnect', () => {
            this.disconnect()
        })

        this.$eventHub.$on('openLocalFile', async (filename: string) => {
            await this.openLocalFile(filename)
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
    }

    beforeDestroy(): void {
        this.$eventHub.$off('trackCurrentJob')
        this.$eventHub.$off('disconnect')
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
        if (this.trackJob) {
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
        this.progressPercent = status
        this.message = message
    }

    async trackCurrentJob(): Promise<void> {
        if (this.currentJob) {
            this.downloading = true
            let file = await this.download(this.currentJob, this.updatePercent)
            if (file) {
                this.downloading = false
                this.progressPercent = 0
                this.beforePrint()
                await viewer.processFile(file)
                viewer.gcodeProcessor.forceRedraw()
                this.trackJob = true
            }
            this.downloading = false
        }
    }

    async openLocalFile(filename: any): Promise<void> {
        if (!filename) return
        const reader = new FileReader()
        reader.addEventListener('load', async (event) => {
            const blob = event?.target?.result
            this.beforePrint()
            await viewer.processFile(blob)
        })
        reader.readAsText(filename)
    }

    disconnect(): void {
        viewer.clearScene(true)
    }
}
</script>
