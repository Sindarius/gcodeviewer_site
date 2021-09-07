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
    top: 5px;
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
import { Component, Ref, Watch } from 'vue-property-decorator'
import ViewerMixin from '@/components/mixin/ViewerMixin'
import { BuildVolume, PrinterStateMotion } from '@/store/printer/types'
import { Viewer as ViewerState } from '@/store/viewer/types'

@Component
export default class Viewer extends ViewerMixin {
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

        //initialize
        if (!Viewer.viewer === null) return
        Viewer.viewer = new GCodeViewer(this.viewercanvas)
        Viewer.viewer.init()
        Viewer.viewer.setCursorVisiblity(true)
        window.onresize = () => {
            Viewer.viewer.resize()
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
            Viewer.viewer.gcodeProcessor.updateFilePosition(to)
        }
    }

    get viewerState(): ViewerState {
        return this.$store.state.viewer
    }

    @Watch('cursorPosition')
    cursorPositionChanged(to: PrinterStateMotion): void {
        Viewer.viewer?.updateToolPosition(to)
    }

    @Watch('buildVolume', { deep: true })
    buildVolumeChanged(to: BuildVolume[]): void {
        for (var axesIdx in to) {
            let axes = to[axesIdx]
            if ('XYZ'.includes(axes.axes)) {
                var letter = axes.axes.toLowerCase()
                Viewer.viewer.bed.buildVolume[letter].min = axes.min
                Viewer.viewer.bed.buildVolume[letter].max = axes.max
            }
        }
        Viewer.viewer.bed.commitBedSize()
        Viewer.viewer.reload()
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
                Viewer.viewer.updateRenderQuality(5)
                this.downloading = false
                this.progressPercent = 0
                await Viewer.viewer.processFile(file)
                Viewer.viewer.gcodeProcessor.forceRedraw()
                this.trackJob = true
            }
            this.downloading = false
        }
    }

    disconnect(): void {
        Viewer.viewer.clearScene(true)
    }
}
</script>
