<template>
    <v-row>
        <v-col cols="2">
            <v-img :contain="true" width="45" height="45" :src="getConnectionIcon"></v-img>
        </v-col>
        <v-col cols="3"> {{ address }} {{ status }} </v-col>
    </v-row>
</template>

<script lang="ts">
import { PrinterStatus } from '@/store/printer/types'
import BaseMixin from '@/components/mixin/BaseMixin'
import { Component } from 'vue-property-decorator'
import BaseConnector from '@/store/connectors/BaseConnector'
import { ConnectionType } from '@/store/connectors/types'

@Component
export default class Status extends BaseMixin {
    get getConnectionIcon(): string {
        try {
            switch (this.$store.state.connections.connection?.connectionType) {
                case ConnectionType.rrf:
                    return require('@/assets/duet.png')

                case ConnectionType.klipper:
                    return require('@/assets/klipper.png')
            }
        } catch {
            //do nothing
        }
        return ''
    }

    get address(): string {
        return this.$store.state.connections.connection?.address ?? ''
    }

    get status(): string {
        if (this.address !== '') {
            return ` -- ${this.$store.state.printer.status}`
        }
        return ''
    }
}
</script>
