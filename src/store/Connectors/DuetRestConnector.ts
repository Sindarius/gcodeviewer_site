import axios from 'axios'
import BaseConnector from './BaseConnector'

export default class DuetRestConnector extends BaseConnector {
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
            console.log(sessionKey)
            if (sessionKey.status == 200) {
                this.connected = true
            }
        } catch {
            //ignore since most versions don't support this at this point
        }

        try {
            this.webSocket = new WebSocket(`${this.protocolWS}://${this.address}/machine`)
            this.webSocket.onmessage = (e) => {
                this.store?.commit('printer/updateDuetModelData', JSON.parse(e.data))
                this.webSocket?.send('OK\n')
            }
            this.webSocket.onopen = (e) => {
                this.connected = true
            }
        } catch {
            this.connected = false
        }
    }

    disconnect() {
        this.webSocket?.close()
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
}
