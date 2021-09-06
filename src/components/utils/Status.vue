<template>
    <div>{{ address }} {{ status }}</div>
</template>

<script lang="ts">
import { PrinterStatus } from '@/store/printer/types'
import BaseMixin from '@/components/mixin/BaseMixin'
import { Component } from 'vue-property-decorator'
import BaseConnector from '@/store/connectors/BaseConnector'

@Component
export default class Status extends BaseMixin {
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
