import Vue from 'vue'

export default class BaseMixin extends Vue {
    async download(filename: string, callback: (status: number) => void): Promise<string | null> {
        return await this.$store.dispatch('connections/download', { filename: filename, callback: callback })
    }
}
