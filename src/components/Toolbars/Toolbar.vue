<template>
    <div>
        <v-btn-toggle class="toggle-align mt-2" dense v-model="selectedButton" multiple>
            <ToolbarItem @click="showFileSelect" :title="$t('viewer.toolbar.openlocal')" icon="mdi-folder-outline"></ToolbarItem>
            <ToolbarItem @click="resetCamera" :title="$t('viewer.toolbar.resetCamera')" icon="mdi-camera-outline"></ToolbarItem>
            <ToolbarItem @click="showToolsDialog = true" :title="$t('viewer.toolbar.toolstitle')" icon="mdi-printer-3d-nozzle-outline"></ToolbarItem>
            <ToolbarItem @click="reloadViewer" :title="$t('viewer.toolbar.reloadViewer')" icon="mdi-reload" :color="reloadRequiredColor"></ToolbarItem>
            <ToolbarPopover :color="qualityColor" :icon="qualityIcon">
                <template v-slot:header>
                    <v-btn @click="reloadViewer"><v-icon size="35">mdi-reload</v-icon></v-btn>
                    <v-spacer></v-spacer>
                    Quality
                </template>
                <template v-slot:content>
                    <RenderQuality></RenderQuality>
                    <RenderMode></RenderMode>
                </template>
            </ToolbarPopover>
            <ToolbarPopover icon="mdi-palette">
                <template v-slot:header>
                    <v-btn @click="reloadViewer"><v-icon size="35">mdi-reload</v-icon></v-btn>
                    <v-spacer></v-spacer>
                    Colors
                </template>
                <template v-slot:content>
                    <RenderColors></RenderColors>
                </template>
            </ToolbarPopover>
            <ToolbarItem @click="liveTrack" v-if="canLiveTrack" :title="$t('viewer.toolbar.liveTrack')" icon="mdi-vhs" color="warning"></ToolbarItem>
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
import ToolbarPopover from './ToolbarPopover.vue'
import RenderQuality from '@/components/quality/RenderQuality.vue'
import RenderMode from '@/components/quality/RenderMode.vue'
import RenderColors from '@/components/quality/RenderColors.vue'

@Component({
    components: {
        ToolsDialog,
        ToolbarItem,
        ToolbarPopover,
        RenderQuality,
        RenderMode,
        RenderColors
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

    get reloadRequiredColor(): string {
        return this.$store.state.viewer.reloadRequired ? 'green' : ''
    }

    get qualityColor(): string {
        return this.renderQuality < 2 ? 'red' : ''
    }

    get qualityIcon(): string {
        if (this.renderQuality < 2) return 'mdi-speedometer-slow'
        if (this.renderQuality < 5) return 'mdi-speedometer-medium'
        return 'mdi-speedometer'
    }

    @Watch('selectedButton') selectedButtonUpdated(): void {
        if (this.selectedButton.length > 0) {
            this.selectedButton.pop()
        }
    }

    get canLiveTrack(): boolean {
        return !this.$store.state.viewer.liveTracking && this.$store.getters['printer/isPrinting'] && !this.showProgress
    }
}
</script>
