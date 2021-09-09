<template>
    <v-dialog v-model="showDialog" width="600">
        <v-card>
            <v-card-title>About the GCode Viewer</v-card-title>
            <v-card-text>
                <p>This viewer was designed and written by Juan Rosario (Sindarius) using BabylonJS.<br /></p>
                <p>
                    This standalone version of the GCode Viewer adds the ability to connect to a RRF/Duet Printer or a Klipper/Moonraker instance for live tracking.<br />
                    This web application runs locally so no data is sent up to a server for processing.
                </p>
                <p>
                    <strong>***NOTE ASMBL Users: The ASMBL voxel rendering feature is not gone!***</strong> <br />
                    Go to the <b>Quality</b> menu and turn on Voxel Mode(ASMBL) to show additive and subtractive gcode. <br />
                    As a bonus you can also use <b>Force Line Mode</b> to see a line version. Subtractive lines will appear red.
                </p>
                <p>
                    If you enjoy this viewer consider buying me a coffee<br />
                    <strong><a href="https://www.buymeacoffee.com/sindarius" target="_blank">https://www.buymeacoffee.com/sindarius</a></strong>
                </p>
                <p>
                    Don't have a gcode file to load.... How about loading a benchy :)
                    <v-btn color="info" @click="loadBenchy">Load a benchy!</v-btn>
                </p>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<style scoped></style>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator'

@Component
export default class About extends Vue {
    @PropSync('show', { type: Boolean }) showDialog!: boolean

    loadBenchy() {
        this.$eventHub.$emit('LoadBenchy')
        this.showDialog = false
    }
}
</script>
