<template>
    <v-card>
        <v-card-title>
            <strong>{{ $t('') }} #{{ toolIndex }}</strong>
        </v-card-title>
        <v-card-text>
            <color-picker v-model="toolColor"></color-picker>
        </v-card-text>
    </v-card>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import ViewerMixin from '../mixin/ViewerMixin'
import { Tool } from '@/store/viewer/types'
import ColorPicker from './ColorPicker.vue'

@Component({
    components: {
        ColorPicker
    }
})
export default class ToolCard extends ViewerMixin {
    @Prop() tool!: Tool
    @Prop() toolIndex!: number

    get toolColor(): string {
        return this.tool.color
    }
    set toolColor(value: string) {
        this.tool.color = value
    }
}
</script>
