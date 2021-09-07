<template>
    <div>
        <v-btn-toggle class="toggle-align" dense v-model="selectedButton" multiple>
            <v-btn @click="showFileSelect" :title="$t('viewer.toolbar.openlocal')"><v-icon>mdi-folder-outline</v-icon></v-btn>
            <v-btn @click="showToolsDialog = true" :title="$t('viewer.toolbar.toolstitle')"><v-icon>mdi-printer-3d-nozzle-outline</v-icon></v-btn>
            <v-btn @click="reloadViewer" :title="$t('viewer.toolbar.reloadViewer')"><v-icon>mdi-reload</v-icon></v-btn>
            <v-btn @click="resetCamera" :title="$t('viewer.toolbar.resetCamera')"><v-icon>mdi-camera-outline</v-icon></v-btn>
        </v-btn-toggle>
        <tools-dialog :show.sync="showToolsDialog"></tools-dialog>
        <input ref="fileInput" type="file" :accept="'.g,.gcode,.gc,.gco,.nc,.ngc,.tap'" hidden @change="fileSelected" />
    </div>
</template>

<style scoped>
.div-align {
    position: relative;
    left: 50%;
    float: left;
}
.toggle-align {
    position: relative;
    left: -50%;
    float: left;
}
</style>

<script lang="ts">
import ToolsDialog from '@/components/tools/ToolsDialog.vue'
import ViewerMixin from '../mixin/ViewerMixin'
import { Component, Ref, Mixins, Watch } from 'vue-property-decorator'

@Component({
    components: {
        ToolsDialog
    }
})
export default class Toolbar extends Mixins(ViewerMixin) {
    showToolsDialog = false
    @Ref('fileInput') fileInput!: HTMLInputElement
    selectedButton = []

    showFileSelect(): void {
        this.fileInput.click()
    }
    fileSelected(e: any): void {
        this.$eventHub.$emit('openLocalFile', e.target.files[0])
    }

    @Watch('selectedButton') selectedButtonUpdated(): void {
        if (this.selectedButton.length > 0) {
            this.selectedButton.pop()
        }
    }
}
</script>
