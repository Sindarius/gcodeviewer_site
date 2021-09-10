<template>
    <div>
        <v-simple-table>
            <tbody>
                <tr>
                    <td>Progress Color</td>
                    <td><ColorPicker v-model="progressColor"></ColorPicker></td>
                </tr>
                <tr>
                    <td>Background Color</td>
                    <td><ColorPicker v-model="backgroundColor"></ColorPicker></td>
                </tr>
                <tr>
                    <td>Grid Color</td>
                    <td><ColorPicker v-model="gridColor"></ColorPicker></td>
                </tr>
            </tbody>
        </v-simple-table>
    </div>
</template>
<style scoped>
tr {
    height: 70px !important;
}
</style>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ViewerMixin from '../mixin/ViewerMixin'
import ColorPicker from '@/components/tools/ColorPicker.vue'

@Component({
    components: {
        ColorPicker
    }
})
export default class RenderColors extends Mixins(ViewerMixin) {}
</script>
