<style scoped="true" lang="scss">
.btnwidth {
    width: 100% !important;
}
</style>

<template>
    <div>
        <v-form @submit.prevent="set_camera" @keypress.enter="set_camera">
            <v-row dense>
                <v-col cols="6">
                    <h3>Camera Position</h3>
                    <v-simple-table header="Set Camera Position">
                        <tbody>
                            <tr>
                                <td>X</td>
                                <td><v-text-field v-model="camera_position_x"></v-text-field></td>
                            </tr>
                            <tr>
                                <td>Y</td>
                                <td><v-text-field v-model="camera_position_y"></v-text-field></td>
                            </tr>
                            <tr>
                                <td>Z</td>
                                <td><v-text-field v-model="camera_position_z"></v-text-field></td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-col>
                <v-col cols="6">
                    <h3>Target Position</h3>
                    <v-simple-table header="Set Camera Position" dense>
                        <tbody>
                            <tr>
                                <td>X</td>
                                <td><v-text-field v-model="target_position_x"></v-text-field></td>
                            </tr>
                            <tr>
                                <td>Y</td>
                                <td><v-text-field v-model="target_position_y"></v-text-field></td>
                            </tr>
                            <tr>
                                <td>Z</td>
                                <td><v-text-field v-model="target_position_z"></v-text-field></td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-col>
            </v-row>

            <v-btn type="submit" class="btnwidth" @click="set_camera">Set Camera</v-btn>
        </v-form>
        <v-text-field v-model="width" />
        <v-text-field v-model="height" />
        <v-btn @click="play_layers" class="btnwidth">Save Layers</v-btn>
        <v-btn @click="take_screenshot" class="btnwidth">Take Screenshot</v-btn>
    </div>
</template>

<script lang="ts">
import ViewerMixin from '@/components/mixin/ViewerMixin'

import { Component, Ref, Mixins, Watch } from 'vue-property-decorator'

@Component({})
export default class CustomActions extends Mixins(ViewerMixin) {
    mounted(): void {
        console.log('mounted')
    }

    width: number = 1920
    height: number = 1080
    camera_x: number = 0
    camera_y: number = 0
    camera_z: number = 0
    target_x: number = 0
    target_y: number = 0
    target_z: number = 0

    get camera_position_x(): number {
        return this.camera_x
    }
    set camera_position_x(value: number) {
        this.camera_x = value
    }

    get camera_position_y(): number {
        return this.camera_y
    }
    set camera_position_y(value: number) {
        this.camera_y = value
    }

    get camera_position_z(): number {
        return this.camera_z
    }

    set camera_position_z(value: number) {
        this.camera_z = value
    }

    get target_position_x(): number {
        return this.target_x
    }

    set target_position_x(value: number) {
        this.target_x = value
    }

    get target_position_y(): number {
        return this.target_y
    }

    set target_position_y(value: number) {
        this.target_y = value
    }

    get target_position_z(): number {
        return this.target_z
    }

    set target_position_z(value: number) {
        this.target_z = value
    }

    set_camera(): void {
        console.log(`Camera ${this.camera_x} ${this.camera_y} ${this.camera_z}`)
        this.setCameraPosition(this.camera_x, this.camera_y, this.camera_z)
        console.log(`Target ${this.target_x} ${this.target_y} ${this.target_z}`)
        this.setCameraTarget(this.target_x, this.target_y, this.target_z)
    }

    take_screenshot(): void {
        this.takeScreenshot(this.width, this.height)
    }
    async play_layers(): Promise<void> {
        await this.playLayers(this.width, this.height)
    }
}
</script>
