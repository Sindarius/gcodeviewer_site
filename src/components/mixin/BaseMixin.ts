import Vue from 'vue'

export default class BaseMixin extends Vue {
    async download(filename: string, callback: (percent: number, text: string) => void): Promise<string | null> {
        return await this.$store.dispatch('connections/download', { filename: filename, callback: callback })
    }
}
