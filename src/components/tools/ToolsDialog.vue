<template>
    <v-dialog v-model="showDialog">
        <v-card>
            <v-card-title>
                <strong> {{ $t('viewer.tools.title') }}</strong>
                <v-spacer></v-spacer>
                <div class="tool-quantity">
                    <v-combobox :hint="$t('viewer.tools.quantity')" persistent-hint :rules="[numberRule]" v-model="toolQty" :items="toolNumbers"> </v-combobox>
                </div>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="4" v-for="(tool, index) in tools" :key="tool.id">
                        <ToolCard :tool="tool" :toolIndex="index"> </ToolCard>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn color="warning" @click="reset"> {{ $t('default.reset') }} </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="info"> {{ $t('default.save') }} </v-btn>
                <v-btn color="error" @click="cancel"> {{ $t('default.cancel') }} </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.tool-quantity {
    width: 100px;
}
</style>

<script lang="ts">
import { Component, PropSync, Watch } from 'vue-property-decorator'
import ViewerMixin from '../mixin/ViewerMixin'
import ToolCard from './ToolCard.vue'
import { Tool } from '@/store/viewer/types'

@Component({
    components: {
        ToolCard
    }
})
export default class ToolsDialog extends ViewerMixin {
    @PropSync('show', { type: Boolean }) private showDialog!: boolean
    tools: Tool[] = []
    toolQty = 1
    toolNumbers = [...Array(10).keys()].map((i) => i + 1)

    reset(): void {
        //Deep copy
        this.tools.splice(0, this.tools.length)
        this.tools.push(...JSON.parse(JSON.stringify(this.$store.state.viewer.tools)))
        this.tools.forEach((t: Tool) => (t.id = Math.random()))
        this.toolQty = this.tools.length
    }

    mounted(): void {
        this.reset()
    }

    save(): void {
        return
    }

    cancel(): void {
        this.showDialog = false
        this.reset()
    }

    numberRule(v: any): any {
        let val = parseInt(v)
        if (!isNaN(val) && val >= 1 && val <= 10) return true
        return this.$t('viewer.tools.qtyerror')
    }

    @Watch('toolQty')
    toolQtyUpdated(to: number): void {
        if (this.numberRule(to) !== true) return

        if (to > this.tools.length) {
            let count = to - this.tools.length - 1

            for (let idx = 0; idx <= count; idx++) {
                this.tools.push(new Tool())
            }
        } else {
            let count = this.tools.length - to - 1
            for (let idx = 0; idx <= count; idx++) {
                this.tools.pop()
            }
        }
    }
}
</script>
