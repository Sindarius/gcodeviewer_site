import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from './BaseMixin'
import { Tool } from '@/store/viewer/types'

let gcodeViewer: any

@Component
export default class ViewerMixin extends Mixins(BaseMixin) {
    static reloadRequired = false

    get tools(): Tool[] {
        return this.$store.state.viewer.tools
    }

    viewer() {
        return gcodeViewer
    }

    setGCodeViewer(value: any) {
        gcodeViewer = value
    }

    get showProgress(): boolean {
        return this.$store.state.viewer.showProgress
    }

    set showProgress(value) {
        this.$store.commit('viewer/showProgress', value)
    }

    get currentFileName(): string {
        return this.$store.state.viewer.currentFileName
    }

    set currentFileName(value: string) {
        this.$store.commit('viewer/updateCurrentFile', value)
    }

    async reloadViewer(): Promise<void> {
        this.showProgress = true
        gcodeViewer.gcodeProcessor.cancelLoad = true
        await new Promise((resolve) => setTimeout(resolve, 500))
        this.beforePrint()
        await gcodeViewer.reload()
        this.showProgress = false
    }

    beforePrint(): void {
        gcodeViewer.updateRenderQuality(5)
        gcodeViewer.gcodeProcessor.useHighQualityExtrusion(true)
        gcodeViewer.gcodeProcessor.resetTools()
        for (let idx = 0; idx < this.tools.length; idx++) {
            const tool = this.tools[idx]
            gcodeViewer.gcodeProcessor.addTool(tool.color, tool.diameter, tool.toolType) //hard code the nozzle size for now.
        }
    }

    resetCamera() {
        gcodeViewer.resetCamera()
    }
}
