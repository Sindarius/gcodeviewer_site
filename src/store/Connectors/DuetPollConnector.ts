import axios from 'axios'
import BaseConnector from './BaseConnector'
import { ConnectionType } from './types'

export default class DuetPollConnector extends BaseConnector {
    pollInterval = -1
    connectionType = ConnectionType.rrf
    constructor(store: any) {
        super(store)
    }

    async connect(address: string, protocol = 'http', password = 'reprap'): Promise<void> {
        if (this.pollInterval == -1) {
            this.disconnect()
        }

        this.protocol = protocol
        this.protocolWS = protocol == 'http' ? 'ws' : 'wss'
        this.address = address
        this.password = password

        const sessionKey = await axios.get(`${protocol}://${this.address}/rr_connect?password=${this.password}`, { responseType: 'text' })
        if (sessionKey.status == 200) {
            this.connected = true
            this.poll()
        }
    }

    async poll() {
        if (!this.connected || this.store === null) return

        const response = await axios.get(`${this.protocol}://${this.address}/rr_model?flags=d99fv`)
        this.store.commit('printer/updateDuetModelData', response.data.result)

        //Get detailed moves
        const moves = await axios.get(`${this.protocol}://${this.address}/rr_model?key=move&flags=d99vn`)
        this.store.commit('printer/updateDuetModelData', { move: moves.data.result })

        const job = await axios.get(`${this.protocol}://${this.address}/rr_model?key=job&flags=d99vn`)
        this.store.commit('printer/updateDuetModelData', { job: job.data.result })

        const count = 0
        this.pollInterval = setInterval(async () => {
            const response = await axios.get(`${this.protocol}://${this.address}/rr_model?flags=d99fn`)
            this.store?.commit('printer/updateDuetModelData', response.data.result)
            const job = await axios.get(`${this.protocol}://${this.address}/rr_model?key=job&flags=d99vn`)
            this.store?.commit('printer/updateDuetModelData', { job: job.data.result })
        }, 250)
    }

    disconnect() {
        clearInterval(this.pollInterval)
        this.pollInterval = -1
        super.disconnect()
    }

    timeToStr(time: Date): string {
        let result = ''
        result += time.getFullYear() + '-'
        result += time.getMonth() + 1 + '-'
        result += time.getDate() + 'T'
        result += time.getHours() + ':'
        result += time.getMinutes() + ':'
        result += time.getSeconds()
        return result
    }

    async downloadFile(filename: string, statusCallback: (percent: number, status: string) => void | null): Promise<string> {
        const encodedFilename = encodeURIComponent(filename)
        const response = await axios.get(`${this.protocol}://${this.address}/rr_download?name=${encodedFilename}`, {
            onDownloadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                statusCallback(percentCompleted, `Downloading ${filename}`)
            }
        })
        return response.data
    }
}
