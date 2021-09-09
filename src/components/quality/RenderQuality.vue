<template>
    <div>
        <v-select dense class="pa-0 mt-4" v-model="renderQuality" :items="items" item-text="name" item-value="value" label="Quality" persistent-hint :hint="renderQualityWarning"> </v-select>
        <v-switch dense class="pa-0" v-model="hqRender" v-if="renderQuality > 4" :label="$t('viewer.settings.hqrender')"></v-switch>
    </div>
</template>

<style scoped></style>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewerMixin from '@/components/mixin/ViewerMixin'

@Component
export default class RenderQuality extends Mixins(ViewerMixin) {
    items = [
        { name: 'Low', value: 1 },
        { name: 'Medium', value: 3 },
        { name: 'High', value: 5 },
        { name: 'Max', value: 6 }
    ]

    get renderQualityWarning(): string {
        if (this.renderQuality === 6) {
            return 'Max quality ignores Force Line Mode '
        }
        return ''
    }
}
</script>
