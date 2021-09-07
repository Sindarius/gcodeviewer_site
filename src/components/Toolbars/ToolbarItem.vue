<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
            <v-btn @click="clicked" v-bind="attrs" v-on="on">
                <v-icon :color="color">{{ icon }}</v-icon>
            </v-btn>
        </template>
        <span>{{ title }}</span>
    </v-tooltip>
</template>

<style scoped></style>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class ToolbarItem extends Vue {
    @Prop() icon!: string
    @Prop() title!: string
    @Prop() color!: string

    clicked() {
        this.$emit('click')
    }
}
</script>
