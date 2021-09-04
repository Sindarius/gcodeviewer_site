<template>
    <v-dialog v-model="showDialog">
        <v-card>
            <v-card-title>Connect To...</v-card-title>
            <v-card-text>
                <span>Address</span>
                <v-text-field v-model="address"></v-text-field>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>

<script lang="ts">
import Vue from 'vue'
import { Component, PropSync } from 'vue-property-decorator'

@Component
export default class ConnectDialog extends Vue {
    @PropSync('show', { type: Boolean }) private showDialog!: boolean
    address = ''
}
</script>
