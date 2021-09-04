<template>
    <v-dialog v-model="showDialog">
        <v-card>
            <v-card-title>Connect To...</v-card-title>
            <v-card-text>
                <span>Address</span>
                <v-text-field v-model="address"></v-text-field>
                <div>{{ curstate }}</div>
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
import BaseConnector from '@/store/connectors/BaseConnector'
import { PrinterState } from '@/store/printer/types'

@Component
export default class ConnectDialog extends Vue {
    @PropSync('show', { type: Boolean }) private showDialog!: boolean
    address = ''
    connector!: BaseConnector

    get curstate(): PrinterState {
        return this.$store.state.printer
    }

    get isConnected(): boolean {
        return this.$store.getters['printer/isConnected']
    }

    connect(): void {
        if (this.isConnected) return
        this.connector = new DuetPollConnector(this.$store)
        this.connector.connect(this.address)
    }
    cancel() {
        this.connector.disconnect()
    }
}
</script>
