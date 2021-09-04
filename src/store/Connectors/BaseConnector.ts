import Vue from 'vue'
import axios, { ResponseType } from 'axios'

export default class BaseConnector {
    protocol = 'http'
    protocolWS = 'ws'
    address = ''
    webSocket: WebSocket | undefined
    sessionKey = ''
    password = 'reprap'
    connected = false
    store = null

    constructor(store: any) {
        this.store = store
    }

    connect(address: string, protocol = 'http', password = 'reprap'): void {
        return
    }

    request(): void {
        return
    }

    disconnect(): void {
        return
    }
}
