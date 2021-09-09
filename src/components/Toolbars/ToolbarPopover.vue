<template>
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" @click.stop="menu = !menu">
                <v-icon class="ma-3" size="30" :color="color"> {{ icon }} </v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <slot name="header"></slot>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="menu = false"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
                <slot name="content"></slot>
            </v-card-text>
        </v-card>
    </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class ToolbarPopover extends Vue {
    menu = false
    @Prop() icon!: string
    @Prop() title!: string
    @Prop() color!: string
}
</script>
