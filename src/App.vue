<template>
    <v-app>
        <v-app-bar app color="primary" dense>
            <Status></Status>
            <!--
            <v-btn @click="dumpState">State</v-btn>
            -->
            <v-spacer></v-spacer>
            <v-btn v-if="!isConnected" @click="showConnectionDialog = true" class="mr-2"><v-icon class="mr-2">mdi-lan-connect</v-icon> Connect</v-btn>
            <v-btn v-else @click="disconnect" class="mr-2"><v-icon class="mr-2">mdi-lan-connect</v-icon> Disconnect</v-btn>
            <v-btn @click="showAboutDialog = true"><v-icon color="green">mdi-information-outline</v-icon></v-btn>
        </v-app-bar>

        <v-main class="main-relative">
            <Viewer />
            <Connect :show.sync="showConnectionDialog"></Connect>
            <Toolbar class="toolbar"></Toolbar>
            <About :show.sync="showAboutDialog"></About>
        </v-main>
    </v-app>
</template>

<style scoped>
.main-relative {
    position: relative;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: orange;
}

.toolbar {
    position: relative;
    left: 50%;
    float: left;
}
</style>

<script lang="ts">
import '@/assets/styles/page.scss'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Viewer from '@/components/ViewerUI/Viewer.vue'
import Connect from '@/components/ViewerUI/Connect.vue'
import Status from '@/components/utils/Status.vue'
import Toolbar from '@/components/Toolbars/Toolbar.vue'
import BaseConnector from './store/connectors/BaseConnector'
import About from '@/components/about/About.vue'

import { PrinterStateMotion, PrinterStatus } from './store/printer/types'

@Component({
    components: {
        Viewer,
        Connect,
        Status,
        Toolbar,
        About
    }
})
export default class App extends Vue {
    showConnectionDialog = false
    showToolsDialog = false
    showAboutDialog = false

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
