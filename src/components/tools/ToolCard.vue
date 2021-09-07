<template>
    <v-card>
        <v-card-title>
            <strong>{{ $t('') }} #{{ toolIndex }}</strong>
        </v-card-title>
        <v-card-text>
            <color-picker v-model="toolColor"></color-picker>
            <v-select hint="Type" persistent-hint :items="toolTypes" v-model="toolType"></v-select>
            <v-text-field hint="Diameter" type="number" persistent-hint v-model="toolDiameter"></v-text-field>
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
    toolTypes = ['Extruder', 'Endmill']

    get toolColor(): string {
        return this.tool.color
    }
    set toolColor(value: string) {
        this.tool.color = value
    }

    get toolType(): string {
        return this.tool.toolType
    }

    set toolType(value: string) {
        this.tool.toolType = value
    }

    get toolDiameter(): number {
        return this.tool.diameter
    }

    set toolDiameter(value: number) {
        if (!isNaN(value)) {
            this.tool.diameter = Number(value)
        } else {
            this.tool.diameter = 0.4
        }
    }
}
</script>
