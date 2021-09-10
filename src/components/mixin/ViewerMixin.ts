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

    get voxelWidth(): number {
        return this.$store.getters['viewer/voxelWidth']
    }

    set voxelWidth(value: number) {
        this.reloadRequired = true
        this.$store.commit('viewer/voxelWidth', value)
    }

    get voxelHeight(): number {
        return this.$store.getters['viewer/voxelHeight']
    }

    set voxelHeight(value: number) {
        this.reloadRequired = true
        this.$store.commit('viewer/voxelHeight', value)
    }

    get travelMoves(): boolean {
        return this.$store.getters['viewer/travelMoves']
    }

    set travelMoves(value: boolean) {
        gcodeViewer.toggleTravels(value)
        this.$store.commit('viewer/travelMoves', value)
    }

    get hqRender(): boolean {
        return this.$store.getters['viewer/hqRender']
    }

    set hqRender(value: boolean) {
        this.reloadRequired = true
        this.$store.commit('viewer/hqRender', value)
    }

    get specular(): boolean {
        return this.$store.getters['viewer/specular']
    }

    set specular(value: boolean) {
        gcodeViewer.gcodeProcessor.useSpecularColor(value)
        this.$store.commit('viewer/specular', value)
    }

    get minFeedRate(): number {
        return this.$store.getters['viewer/minfeedrate']
    }

    set minFeedRate(value: number) {
        this.reloadRequired = true
        this.$store.commit('viewer/minfeedrate', value)
    }

    get maxFeedRate(): number {
        return this.$store.getters['viewer/maxfeedrate']
    }

    set maxFeedRate(value: number) {
        this.reloadRequired = true
        this.$store.commit('viewer/maxfeedrate', value)
    }

    get minFeedColor(): string {
        return this.$store.getters['viewer/minfeedcolor']
    }

    set minFeedColor(value: string) {
        this.reloadRequired = true
        this.$store.commit('viewer/minfeedcolor', value)
    }

    get maxFeedColor(): string {
        return this.$store.getters['viewer/maxfeedcolor']
    }

    set maxFeedColor(value: string) {
        this.reloadRequired = true
        this.$store.commit('viewer/maxfeedcolor', value)
    }

    get transparency(): boolean {
        return this.$store.getters['viewer/transparency']
    }

    set transparency(value: boolean) {
        this.reloadRequired = true
        this.$store.commit('viewer/transparency', value)
    }

    get progressColor(): string {
        return this.$store.getters['viewer/progressColor']
    }

    set progressColor(value: string) {
        gcodeViewer.setProgressColor(this.progressColor)
        this.$store.commit('viewer/progressColor', value)
    }

    get backgroundColor(): string {
        return this.$store.getters['viewer/backgroundColor']
    }

    set backgroundColor(value: string) {
        gcodeViewer.setBackgroundColor(this.backgroundColor)
        gcodeViewer.forceRender()
        this.$store.commit('viewer/backgroundColor', value)
    }

    get gridColor(): string {
        return this.$store.getters['viewer/gridColor']
    }

    set gridColor(value: string) {
        gcodeViewer.bed.setBedColor(value)
        this.$store.commit('viewer/gridColor', value)
    }

    async reloadViewer(): Promise<void> {
        this.reloadRequired = false
        this.showProgress = true
        gcodeViewer.gcodeProcessor.cancelLoad = true
        await new Promise((resolve) => setTimeout(resolve, 500))
        this.beforeRender()
        await gcodeViewer.reload()
        gcodeViewer.gcodeProcessor.forceRedraw()
        this.showProgress = false
    }

    beforeRender(): void {
        if (this.voxelMode) {
            gcodeViewer.gcodeProcessor.voxelWidth = this.voxelWidth
            gcodeViewer.gcodeProcessor.voxelHeight = this.voxelHeight
        }
        gcodeViewer.setZClipPlane(1000000, -1000000)
        gcodeViewer.setBackgroundColor(this.backgroundColor)
        gcodeViewer.setProgressColor(this.progressColor)
        gcodeViewer.bed.setBedColor(this.gridColor)
        gcodeViewer.gcodeProcessor.useSpecularColor(this.specular)
        gcodeViewer.toggleTravels(this.travelMoves)
        gcodeViewer.gcodeProcessor.setColorMode(this.renderMode)
        gcodeViewer.gcodeProcessor.updateForceWireMode(this.lineMode)
        gcodeViewer.gcodeProcessor.setVoxelMode(this.voxelMode)
        gcodeViewer.updateRenderQuality(this.renderQuality)
        gcodeViewer.gcodeProcessor.useHighQualityExtrusion(this.hqRender)
        gcodeViewer.gcodeProcessor.resetTools()
        gcodeViewer.gcodeProcessor.setAlpha(this.transparency)
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
