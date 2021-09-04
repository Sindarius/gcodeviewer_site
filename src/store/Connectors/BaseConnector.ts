import Vue from 'vue'
import axios, { ResponseType } from 'axios'

export default class BaseConnector extends Vue {
    address = ''
    webSocket: WebSocket | undefined
    sessionKey = ''

    request(): void {}
}
