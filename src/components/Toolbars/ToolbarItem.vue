<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on }">
            <v-btn v-bind="size" @click.stop="clicked" v-on="on">
                <v-icon v-bind="size" :color="color">{{ icon }}</v-icon>
            </v-btn>
        </template>
        <span class="whitespace-line">{{ title }}</span>
    </v-tooltip>
</template>

<style scoped>
.whitespace-line {
    white-space: pre-line;
    text-align: center;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class ToolbarItem extends Vue {
    @Prop() icon!: string
    @Prop() title!: string
    @Prop() color!: string

    clicked(): void {
        this.$emit('click')
    }

    get size(): any {
        const size = { xs: '', sm: 'medium', md: '', lg: 'large', xl: 'x-large' }[this.$vuetify.breakpoint.name]
        return size ? { [size]: true } : {}
    }
}
</script>
