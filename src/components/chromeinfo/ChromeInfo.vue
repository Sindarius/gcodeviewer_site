<template>
    <v-dialog v-model="showDialog" width="600">
        <v-card>
            <v-card-title>
                <span><v-icon>mdi-google-chrome</v-icon>Chrome Info</span>
                <v-card-text>
                    <div>Due to changes in Google Chrome you have to change the <i>Block insecure private network requests</i> settings to disabled to connect to a local printer.</div>
                    <br />
                    <div>Link : chrome://flags/#block-insecure-private-network-requests</div>
                    <v-img :src="require('@/assets/chromeinfo.png')"></v-img>
                </v-card-text>
            </v-card-title>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator'

@Component
export default class ChromeInfo extends Vue {
    @PropSync('show', { type: Boolean }) showDialog!: boolean
}
</script>
