import Vue from 'vue'
import axios, { Method, ResponseType } from 'axios'
import { Store } from 'vuex'
import { ConnectionType } from './types'

export default class BaseConnector {
    protocol = 'http'
    protocolWS = 'ws'
    address = ''
    webSocket: WebSocket | undefined
    sessionKey = ''
    password = 'reprap'
    connected = false
    store: Store<any> | null
    connectionType: ConnectionType = ConnectionType.unknown

    constructor(store: any) {
        this.store = store
    }

    async connect(address: string, password = 'reprap', protocol = 'http'): Promise<void> {
        return
    }

    request(): void {
        return
    }

    disconnect(): void {
        this.connected = false
        this.store?.commit('printer/clear', {})
        this.store?.commit('connections/clear', {})
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
        return ''
    }
}
