<template>
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
        <template v-slot:activator="{ on }">
            <v-btn v-bind="size" v-on="on" @click.stop="menu = !menu">
                <v-icon v-bind="size" :color="color"> {{ icon }} </v-icon>
            </v-btn>
        </template>
        <v-card outlined shaped elevation="10">
            <v-card-title>
                <slot name="header"></slot>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="menu = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text class="overflow-y-auto card-overflow">
                <slot name="content"></slot>
            </v-card-text>
        </v-card>
    </v-menu>
</template>

<style scoped>
.card-overflow {
    margin-top: 20px;
    max-height: 80vh;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class ToolbarPopover extends Vue {
    menu = false
    @Prop() icon!: string
    @Prop() title!: string
    @Prop() color!: string

    get size(): any {
        const size = { xs: '', sm: 'medium', md: '', lg: 'large', xl: 'x-large' }[this.$vuetify.breakpoint.name]
        return size ? { [size]: true } : {}
    }
}
</script>
