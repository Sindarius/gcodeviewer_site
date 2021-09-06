<template>
    <v-app>
        <v-app-bar app color="primary" dark dense>
            <Status></Status>
            <v-btn @click="downloadTest">Download</v-btn>
            <v-btn @click="dumpState">State</v-btn>
            <v-spacer></v-spacer>
            <v-btn v-if="!isConnected" @click="showConnectionDialog = true"><v-icon class="mr-2">mdi-lan-connect</v-icon> Connect</v-btn>
            <v-btn v-else @click="disconnect"><v-icon class="mr-2">mdi-lan-connect</v-icon> Disconnect</v-btn>
        </v-app-bar>

        <v-main class="main-relative">
            <Viewer />
            <Connect :show.sync="showConnectionDialog"></Connect>
        </v-main>
    </v-app>
</template>

<style scoped>
.main-relative {
    position: relative;
    background-color: orange;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Viewer from '@/components/ViewerUI/Viewer.vue'
import Connect from '@/components/ViewerUI/Connect.vue'
import Status from '@/components/utils/Status.vue'
import BaseConnector from './store/connectors/BaseConnector'
import { PrinterStateMotion, PrinterStatus } from './store/printer/types'

@Component({
    components: {
        Viewer,
        Connect,
        Status
    }
})
export default class App extends Vue {
    showConnectionDialog = false

    get connection(): BaseConnector {
        return this.$store.state.connections.connection
    }

    get motion(): PrinterStateMotion {
        return this.$store.state.printer.motion
    }

    get status(): PrinterStatus {
        return this.$store.state.printer.status
    }

    get isConnected(): boolean {
        return this.$store.getters['connections/isConnected']
    }

    updateStatus(status: number): void {
        console.log(status)
    }

    async downloadTest(): Promise<void> {
        this.$eventHub.$emit('trackCurrentJob')
    }

    dumpState(): void {
        console.log(this.$store.state)
    }

    disconnect(): void {
        this.connection.disconnect()
        this.$eventHub.$emit('disconnect')
    }
}
</script>
