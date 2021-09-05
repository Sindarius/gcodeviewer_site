import Vue from 'vue'
import axios, { ResponseType } from 'axios'
import { Store } from 'vuex'

export default class BaseConnector {
    protocol = 'http'
    protocolWS = 'ws'
    address = ''
    webSocket: WebSocket | undefined
    sessionKey = ''
    password = 'reprap'
    connected = false
    store: Store<any> | null

    constructor(store: any) {
        this.store = store
    }

    async connect(address: string, protocol = 'http', password = 'reprap'): Promise<void> {
        return
    }

    request(): void {
        return
    }

    disconnect(): void {
        this.connected = false
        this.store?.commit('printer/clear', {})
    }
}
