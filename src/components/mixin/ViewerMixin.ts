import { Component, Mixins } from 'vue-property-decorator'
import BaseMixin from './BaseMixin'
import { Tool } from '@/store/viewer/types'
import store from '@/store'

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

    get liveTracking(): boolean {
        return this.$store.state.viewer.liveTracking
    }

    set liveTracking(value: boolean) {
        this.$store.commit('viewer/liveTracking', value)
    }

    get reloadRequired(): boolean {
        return this.$store.state.viewer.reloadRequired
    }

    set reloadRequired(value: boolean) {
        this.$store.commit('viewer/reloadRequired', value)
    }

    get renderQuality(): number {
        return this.$store.getters['viewer/renderQuality']
    }

    set renderQuality(value: number) {
        this.reloadRequired = true
        this.$store.commit('viewer/renderQuality', value)
    }

    get renderMode(): number {
        return this.$store.getters['viewer/renderMode']
    }

    set renderMode(value: number) {
        this.reloadRequired = true
        this.$store.commit('viewer/renderMode', value)
    }

    get lineMode(): boolean {
        return this.$store.getters['viewer/lineMode']
    }

    set lineMode(value: boolean) {
        this.reloadRequired = true
        this.$store.commit('viewer/lineMode', value)
    }

    get voxelMode(): boolean {
        return this.$store.getters['viewer/voxelMode']
    }

    set voxelMode(value: boolean) {
        this.reloadRequired = true
        this.$store.commit('viewer/voxelMode', value)
    }

    get travelMoves(): boolean {
        return this.$store.getters['viewer/travelMoves']
    }

    set travelMoves(value: boolean) {
        gcodeViewer.toggleTravels(value)
        this.$store.commit('viewer/travelMoves', value)
    }

    async reloadViewer(): Promise<void> {
        this.reloadRequired = false
        this.showProgress = true
        gcodeViewer.gcodeProcessor.cancelLoad = true
        await new Promise((resolve) => setTimeout(resolve, 500))
        this.beforeRender()
        await gcodeViewer.reload()
        gcodeViewer.forceRedraw()
        this.showProgress = false
    }

    beforeRender(): void {
        gcodeViewer.toggleTravels(this.travelMoves)
        gcodeViewer.gcodeProcessor.setColorMode(this.renderMode)
        gcodeViewer.gcodeProcessor.updateForceWireMode(this.lineMode)
        gcodeViewer.gcodeProcessor.setVoxelMode(this.voxelMode)
        gcodeViewer.updateRenderQuality(this.renderQuality)
        gcodeViewer.gcodeProcessor.useHighQualityExtrusion(true)
        gcodeViewer.gcodeProcessor.resetTools()
        for (let idx = 0; idx < this.tools.length; idx++) {
            const tool = this.tools[idx]
            gcodeViewer.gcodeProcessor.addTool(tool.color, tool.diameter, tool.toolType) //hard code the nozzle size for now.
            gcodeViewer.gcodeProcessor.tools[idx].toolType = tool.toolType //Patch until package can be updated
        }
    }

    resetCamera() {
        gcodeViewer.resetCamera()
    }
}
