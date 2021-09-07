<template>
    <div>
        <v-btn-toggle class="toggle-align" dense v-model="selectedButton" multiple>
            <ToolbarItem @click="showFileSelect" :title="$t('viewer.toolbar.openlocal')" icon="mdi-folder-outline"></ToolbarItem>
            <ToolbarItem @click="showToolsDialog = true" :title="$t('viewer.toolbar.toolstitle')" icon="mdi-printer-3d-nozzle-outline"></ToolbarItem>
            <ToolbarItem @click="reloadViewer" :title="$t('viewer.toolbar.reloadViewer')" icon="mdi-reload" :color="reloadRequiredColor"></ToolbarItem>
            <ToolbarItem @click="resetCamera" :title="$t('viewer.toolbar.resetCamera')" icon="mdi-camera-outline"></ToolbarItem>
            <ToolbarItem @click="liveTrack" v-if="canLiveTrack" :title="$t('viewer.toolbar.liveTrack')" icon="mdi-vhs"></ToolbarItem>
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
import ToolbarItem from './ToolbarItem.vue'

@Component({
    components: {
        ToolsDialog,
        ToolbarItem
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

    liveTrack(): void {
        this.$eventHub.$emit('trackCurrentJob')
    }

    get reloadRequiredColor() {
        return this.$store.state.viewer.reloadRequired ? 'green' : ''
    }

    @Watch('selectedButton') selectedButtonUpdated(): void {
        if (this.selectedButton.length > 0) {
            this.selectedButton.pop()
        }
    }

    get canLiveTrack(): boolean {
        return !this.$store.state.viewer.liveTracking && this.$store.getters['printer/isPrinting']
    }
}
</script>
