<template>
    <div>
        <v-btn-toggle class="toggle-align">
            <v-btn @click="showToolsDialog = true" :title="$t('viewer.toolbar.toolstitle')"><v-icon size="xx-large">mdi-printer-3d-nozzle-outline</v-icon></v-btn>
        </v-btn-toggle>
        <tools-dialog :show.sync="showToolsDialog"></tools-dialog>
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
import { Component } from 'vue-property-decorator'

@Component({
    components: {
        ToolsDialog
    }
})
export default class Toolbar extends ViewerMixin {
    showToolsDialog = false
}
</script>
