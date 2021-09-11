<template>
    <div class="div-style">
        <span v-if="getConnectionIcon === ''" :class="getLabelStyle">Sindarius G-Code Viewer</span>
        <span>
            <v-img :contain="true" width="45" height="45" class="align-text mr-3" :src="getConnectionIcon"></v-img>
            <span :class="getLabelStyle">{{ address }} {{ status }}</span>
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
.address-text-sm {
    font-weight: bold;
    font-size: small;
    text-align: left;
    vertical-align: center;
}
</style>

<script lang="ts">
import BaseMixin from '@/components/mixin/BaseMixin'
import { Component, Mixins } from 'vue-property-decorator'
import { ConnectionType } from '@/store/connectors/types'

@Component
export default class Status extends Mixins(BaseMixin) {
    get getConnectionIcon(): string {
        try {
            switch (this.$store.state.connections.connection?.connectionType) {
                case ConnectionType.rrf:
                    return require('@/assets/duet.png')

                case ConnectionType.klipper:
                    return require('@/assets/klipper.png')
                case ConnectionType.octoprint:
                    return require('@/assets/octoprint.png')
            }
        } catch {
            //do nothing
        }
        return ''
    }

    get getLabelStyle() {
        return this.isMobile ? 'address-text-sm' : 'address-text'
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
