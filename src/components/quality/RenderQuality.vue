<template>
    <v-select v-model="renderQuality" :items="items" item-text="name" item-value="value" hint="Quality" persistent-hint> </v-select>
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
}
</script>
