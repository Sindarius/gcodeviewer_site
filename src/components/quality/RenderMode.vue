<template>
    <div>
        <v-row>
            <v-col cols="6">
                <v-select v-model="renderMode" :items="items" item-text="name" item-value="value" label="Render Mode" persistent-hint> </v-select>
                <v-row dense v-if="renderMode === 1">
                    <v-col cols="6">
                        <v-text-field v-model="minFeedRate" type="number" :label="$t('viewer.settings.minfeedrate')"></v-text-field>
                    </v-col>
                    <v-col cols="6"><color-picker v-model="minFeedColor"></color-picker> </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="maxFeedRate" type="number" :label="$t('viewer.settings.maxfeedrate')"></v-text-field>
                    </v-col>
                    <v-col cols="6"><color-picker v-model="maxFeedColor"></color-picker> </v-col>
                </v-row>
                <v-switch class="mt-1 mb-0" v-model="travelMoves" dense label="Show Travel Moves"></v-switch>
                <v-switch class="mt-1 mb-0" v-model="progressMode" dense label="Progress Mode"></v-switch>

                <v-switch class="ma-0" v-model="transparency" dense :label="$t('viewer.settings.transparency')"></v-switch>
                <v-slider v-if="transparency" min="0" max="100" step="1" v-model="transparentPercent"></v-slider>
                <v-switch class="ma-0" v-model="lineMode" dense :label="$t('viewer.settings.forceLineMode')"></v-switch>
                <v-switch class="ma-0" v-model="voxelMode" dense :label="$t('viewer.settings.voxelMode')"></v-switch>
                <v-row v-if="voxelMode">
                    <v-col cols="6">
                        <v-text-field type="number" v-model="voxelWidth" :label="$t('viewer.settings.voxelWidth')"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field type="number" v-model="voxelHeight" :label="$t('viewer.settings.voxelHeight')"></v-text-field>
                    </v-col>
                    <v-switch class="mt-1 mb-0" v-model="specular" dense :label="$t('viewer.settings.useSpecular')"></v-switch>
                    <v-switch class="mt-1 mb-0" v-model="g1AsExtrusion" dense :label="$t('viewer.settings.g1AsExtrusion')"></v-switch>
                </v-row>
            </v-col>
            <v-col cols="6">
                <v-switch class="mt-1 mb-0" v-model="showGCodeStream" dense :label="$t('viewer.settings.showGCodeStream')"></v-switch>

                <v-switch class="mt-1 mb-0" v-model="showNozzle" dense :label="$t('viewer.settings.showNozzle')"></v-switch>
                <v-switch class="mt-1 mb-0" v-model="showBed" dense :label="$t('viewer.settings.showBed')"></v-switch>
                <v-switch class="mt-1 mb-0" v-model="showAxis" dense :label="$t('viewer.settings.showAxis')"></v-switch>

                <v-switch class="mt-1 mb-0" v-model="perimeterOnly" dense :label="$t('viewer.settings.perimeterOnly')"></v-switch>
                <v-text-field type="number" v-model="fileOffset" dense :label="$t('viewer.settings.fileOffset')" hint="Adjust if print appears faster than cursor"></v-text-field>
                <v-switch class="mt-1 mb-0" v-model="zBelt" dense :label="$t('viewer.settings.zBelt')"></v-switch>
                <v-text-field v-show="zBelt" type="number" v-model="zBeltAngle" dense :label="$t('viewer.settings.zBeltAngle')" hint="Gantry Angle"></v-text-field>
            </v-col>
        </v-row>
    </div>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewerMixin from '@/components/mixin/ViewerMixin'
import ColorPicker from '@/components/tools/ColorPicker.vue'

@Component({ components: { ColorPicker } })
export default class Mode extends Mixins(ViewerMixin) {
    items = [
        { name: 'Color', value: 0 },
        { name: 'Feed Rate', value: 1 },
        { name: 'Feature', value: 2 }
    ]
}
</script>
