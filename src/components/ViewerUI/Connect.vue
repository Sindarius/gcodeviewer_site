<template>
    <v-dialog v-model="showDialog">
        <v-card>
            <v-card-title>Connect To...</v-card-title>
            <v-card-text>
                <span>Address</span>
                <v-text-field v-model="address"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="info" @click="connect">Connect</v-btn>
                <v-btn color="error" @click="cancel">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>

<script lang="ts">
import Vue from 'vue'
import { Component, PropSync } from 'vue-property-decorator'
import DuetPollConnector from '@/store/connectors/DuetPollConnector'
import DuetRestConnector from '@/store/connectors/DuetRestConnector'
import BaseConnector from '@/store/connectors/BaseConnector'

@Component
export default class ConnectDialog extends Vue {
    @PropSync('show', { type: Boolean }) private showDialog!: boolean
    address = ''
    connector!: BaseConnector

    get isConnected(): boolean {
        return this.$store.getters['connections/isConnected']
    }

    get currentConnection(): BaseConnector {
        return this.$store.state.connection
    }

    async connect(): Promise<void> {
        if (this.isConnected) return

        //Try poll connection
        try {
            this.connector = new DuetPollConnector(this.$store)
            await this.connector.connect(this.address)
        } catch {
            //try rest connector
            if (!this.connector.connected) {
                this.connector = new DuetRestConnector(this.$store)
                await this.connector.connect(this.address)
            }
        }

        this.$store.commit('connections/setConnection', this.connector)
        this.showDialog = false
    }
    cancel(): void {
        this.showDialog = false
    }
}
</script>
