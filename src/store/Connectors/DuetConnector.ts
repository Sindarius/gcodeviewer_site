import BaseConnector from './BaseConnector'

export default class DuetConnector extends BaseConnector {
    Connect(address: string, protocol = 'http'): void {
        this.address = address
        this.webSocket = new WebSocket(`${protocol}://${address}`)
    }

    messageReceived(event: MessageEvent): void {}
}
