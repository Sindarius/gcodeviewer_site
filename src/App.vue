<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-spacer></v-spacer>
            <v-btn @click="showConnectionDialog = true"><v-icon>mdi-lan-connect</v-icon> Connect</v-btn>
        </v-app-bar>

        <v-main>
            <Viewer />
            <Connect :show.sync="showConnectionDialog"></Connect>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import Viewer from '@/components/ViewerUI/Viewer.vue'
import Connect from '@/components/ViewerUI/Connect.vue'

@Component({
    components: {
        Viewer,
        Connect
    }
})
export default class App extends Vue {
    showConnectionDialog = false
}
</script>
