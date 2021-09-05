<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            {{ motion }} {{ status }}
            <v-spacer></v-spacer>
            <v-btn v-if="!isConnected" @click="showConnectionDialog = true"><v-icon>mdi-lan-connect</v-icon> Connect</v-btn>
            <v-btn v-else @click="disconnect"><v-icon>mdi-lan-connect</v-icon> Disconnect</v-btn>
        </v-app-bar>

        <v-main>
            <Viewer />
            <Connect :show.sync="showConnectionDialog"></Connect>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Viewer from '@/components/ViewerUI/Viewer.vue'
import Connect from '@/components/ViewerUI/Connect.vue'
import BaseConnector from './store/connectors/BaseConnector'
import { PrinterStateMotion, PrinterStatus } from './store/printer/types'

@Component({
    components: {
        Viewer,
        Connect
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

    disconnect(): void {
        this.connection.disconnect()
    }
}
</script>
