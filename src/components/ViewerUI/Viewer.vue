<template>
    <canvas class="canvasSizing" ref="viewercanvas" />
</template>

<script lang="ts">
// @ts-ignore
import GCodeViewer from '@sindarius/gcodeviewer'
import { Component, Ref } from 'vue-property-decorator'
import ViewerMixin from '@/components/mixin/ViewerMixin'

@Component
export default class Viewer extends ViewerMixin {
    @Ref('viewercanvas') viewercanvas!: HTMLCanvasElement

    mounted(): void {
        if (!Viewer.viewer === null) return
        Viewer.viewer = new GCodeViewer(this.viewercanvas)
        Viewer.viewer.init()

        window.onresize = () => {
            Viewer.viewer.resize()
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.canvasSizing {
    width: 100%;
    height: 100%;
}
</style>
