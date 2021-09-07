import axios from 'axios'
import { ConnectionType } from './types'
import BaseConnector from './BaseConnector'

export default class DuetRestConnector extends BaseConnector {
    connectionType = ConnectionType.rrf

    constructor(store: any) {
        super(store)
    }

    async connect(address: string, protocol = 'http', password = 'reprap'): Promise<void> {
        this.protocol = protocol
        this.protocolWS = protocol == 'http' ? 'ws' : 'wss'
        this.address = address
        this.password = password
        try {
            const sessionKey = await axios.get(`${protocol}://${this.address}/machine/connect`)
            if (sessionKey.status == 200) {
                this.connected = true
            }
        } catch {
            //ignore since most versions don't support this at this point - Need to look at adding SBC password support
        }

        try {
            return new Promise((resolve, reject) => {
                this.webSocket = new WebSocket(`${this.protocolWS}://${this.address}/machine`)
                this.webSocket.onmessage = (e) => {
                    this.store?.commit('printer/updateDuetModelData', JSON.parse(e.data))
                    this.webSocket?.send('OK\n')
                    resolve()
                }
                this.webSocket.onopen = (e) => {
                    this.connected = true
                    resolve()
                }
                this.webSocket.onerror = (e) => {
                    this.connected = false
                    resolve()
                }
            })
        } catch {
            this.connected = false
        }
    }

    disconnect() {
        this.webSocket?.close()
        super.disconnect()
    }

    async downloadFile(filename: string, statusCallback: (percent: number, status: string) => void | null): Promise<string> {
        const encodedFilename = encodeURIComponent(filename)
        const response = await axios.get(`${this.protocol}://${this.address}/machine/file/${encodedFilename}`, {
            onDownloadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100
                statusCallback(percentCompleted, `Downloading ${filename}`)
            }
        })
        return response.data
    }
}
