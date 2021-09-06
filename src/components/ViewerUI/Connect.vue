<template>
    <v-dialog v-model="showDialog" max-width="400">
        <v-card>
            <v-form @submit.prevent="connect">
                <v-card-title>Connect To...</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" v-show="error.length > 0">
                            {{ error }}
                        </v-col>
                        <v-col cols="12">
                            <v-btn-toggle v-model="connectionType" mandatory dense>
                                <v-btn> <v-img width="25" height="25" class="mr-2" :contain="true" :src="require('@/assets/duet.png')"></v-img> RRF/Duet</v-btn>
                                <v-btn> <v-img width="25" height="25" class="mr-2" :contain="true" :src="require('@/assets/klipper.png')"></v-img> Klipper</v-btn>
                            </v-btn-toggle>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field hint="Address" :persistent-hint="true" v-model="address"></v-text-field>
                            <v-text-field v-show="connectionType === 0" hint="Password (Optional)" :persistent-hint="true" v-model="password"></v-text-field>
                            <v-text-field v-show="connectionType === 1" hint="API Key (Optional)" :persistent-hint="true" v-model="password"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :loading="busy" color="info" type="submit">Connect</v-btn>
                    <v-btn :disabled="busy" color="error" @click="cancel">Cancel</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>

<script lang="ts">
import Vue from 'vue'
import { Component, PropSync } from 'vue-property-decorator'
import DuetPollConnector from '@/store/connectors/DuetPollConnector'
import DuetRestConnector from '@/store/connectors/DuetRestConnector'
import KlipperRestConnector from '@/store/connectors/KlipperRestConnector'
import BaseConnector from '@/store/connectors/BaseConnector'
import { ConnectionType } from '@/store/connectors/types'

@Component
export default class ConnectDialog extends Vue {
    @PropSync('show', { type: Boolean }) private showDialog!: boolean
    address = ''
    connector!: BaseConnector
    connectionType: ConnectionType = ConnectionType.rrf
    password = ''
    error = ''
    busy = false

    mounted(): void {
        try {
            let lastConnection = this.$store.getters['connections/getLastConnection']
            if (lastConnection) {
                this.address = lastConnection.address
                this.connectionType = lastConnection.connectionType
            }
        } catch (ex) {
            //Do nothing
        }
    }

    get isConnected(): boolean {
        return this.$store.getters['connections/isConnected']
    }

    get currentConnection(): BaseConnector {
        return this.$store.state.connection
    }

    async connect(): Promise<void> {
        if (this.isConnected) return

        this.busy = true

        switch (this.connectionType) {
            case 0:
                //Try poll connection
                try {
                    this.connector = new DuetPollConnector(this.$store)
                    await this.connector.connect(this.address)
                } catch {
                    //do nothing
                }

                //try rest connector
                try {
                    if (!this.connector.connected) {
                        this.connector = new DuetRestConnector(this.$store)
                        await this.connector.connect(this.address)
                    }
                } catch {
                    //do nothing
                }

                break
            case 1:
                try {
                    //try rest connector
                    this.connector = new KlipperRestConnector(this.$store)
                    await this.connector.connect(this.address)
                } catch {
                    //do nothing
                }
                break
        }

        this.busy = false
        if (!this.connector.connected) {
            this.error = `Unable to connect to ${this.address}`
            return
        }
        this.$store.commit('connections/setConnection', this.connector)
        this.showDialog = false
    }
    cancel(): void {
        this.showDialog = false
    }
}
</script>
