<template>
    <div>
        <v-select v-model="renderMode" :items="items" item-text="name" item-value="value" hint="Render Mode" persistent-hint> </v-select>
        <v-row dense v-if="renderMode === 1">
            <v-col cols="6">a </v-col>
            <v-col cols="6">b </v-col>
            <v-col cols="6">c </v-col>
            <v-col cols="6">d </v-col>
        </v-row>
        <v-switch class="mt-1 mb-0" v-model="travelMoves" dense label="Show Travel Moves"></v-switch>
        <v-switch class="ma-0" v-model="lineMode" dense label="Force Line Mode"></v-switch>
        <v-switch class="ma-0" v-model="voxelMode" dense label="Voxel Mode (ASMBL)"></v-switch>
    </div>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewerMixin from '@/components/mixin/ViewerMixin'

@Component
export default class Mode extends Mixins(ViewerMixin) {
    items = [
        { name: 'Color', value: 0 },
        { name: 'Feed Rate', value: 1 },
        { name: 'Feature', value: 2 }
    ]
}
</script>
