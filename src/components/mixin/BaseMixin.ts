import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class BaseMixin extends Vue {
    async download(filename: string, callback: (percent: number, text: string) => void): Promise<string | null> {
        return await this.$store.dispatch('connections/download', { filename: filename, callback: callback })
    }

    get isMobile(): boolean {
        switch (this.$vuetify.breakpoint.name) {
            case 'xs':
            case 'sm':
                return true
        }
        return false
    }
}
