<template>
    <div class="div-style mr-5">
        <span v-if="getConnectionIcon === ''" class="address-text">Sindarius G-Code Viewer</span>
        <span>
            <v-img :contain="true" width="45" height="45" class="align-text mr-3" :src="getConnectionIcon"></v-img>
            <span class="address-text">{{ address }} {{ status }}</span>
        </span>
    </div>
</template>

<style scoped>
.div-style {
    align-content: center;
    text-align: center;
    vertical-align: middle;
}
.align-text {
    display: inline-block;
    align-content: center;
    vertical-align: middle;
}
.address-text {
    font-weight: bold;
    font-size: x-large;
    text-align: center;
    vertical-align: middle;
}
</style>

<script lang="ts">
import BaseMixin from '@/components/mixin/BaseMixin'
import { Component } from 'vue-property-decorator'
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
