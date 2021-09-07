<template>
    <div>
        <v-btn-toggle class="toggle-align" dense v-model="selectedButton" multiple>
            <v-btn @click="showFileSelect" :title="$t('viewer.toolbar.download')"><v-icon>mdi-folder-outline</v-icon></v-btn>
            <v-btn @click="showToolsDialog = true" :title="$t('viewer.toolbar.toolstitle')"><v-icon>mdi-printer-3d-nozzle-outline</v-icon></v-btn>
            <v-btn @click="reload"><v-icon>mdi-reload</v-icon></v-btn>
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

    async reload(): Promise<void> {
        await this.reloadViewer()
    }

    @Watch('selectedButton') selectedButtonUpdated(): void {
        if (this.selectedButton.length > 0) {
            this.selectedButton.pop()
        }
    }
}
</script>
