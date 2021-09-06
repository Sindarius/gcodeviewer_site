import axios from 'axios'
import BaseConnector from './BaseConnector'
import { ConnectionType } from './types'

export default class KlipperRestConnector extends BaseConnector {
    connectionType = ConnectionType.klipper
    connection_id = ''
    pollInterval = -1

    constructor(store: any) {
        super(store)
    }

    //Use the Password for API Key if specified
    async connect(address: string, protocol = 'http', password = ''): Promise<void> {
        this.address = address
        this.password = password
        let apiKey = password

        if (!this.address.includes(':')) {
            this.address += ':7125' //Default moonraker port
        }

        //get oneshot token - Try to get one shot if we don't have the API_KEY provided
        if (apiKey === '') {
            const token = await axios.get(`http://${this.address}/access/oneshot_token`)
            const ost = token.data.result

            const apiKeyEndPoint = await axios.get(`http://${this.address}/access/api_key?token=${ost}`)
            apiKey = apiKeyEndPoint.data.result
        }

        let socketAddress = `ws://${this.address}/websocket`
        if (apiKey) {
            socketAddress += `?token=${apiKey}`
        }

        //const data = await axios.get(`${this.protocol}://${this.address}/printer/objects/list`)
        //console.log(data.data)

        const stats = await axios.get(`${this.protocol}://${this.address}/printer/objects/query?configfile&webhooks&motion_report&virtual_sdcard&display_status`)
        this.store?.commit('printer/updateKlipperModelData', stats.data.result.status)

        return new Promise((resolve) => {
            /*
            console.log(socketAddress)
            this.webSocket = new WebSocket(socketAddress)
            this.webSocket.onmessage = (e) => {
                this.connected = true
                this.store?.commit('printer/updateKlipperModelData', JSON.parse(e.data))
                resolve()
            }
            this.webSocket.onerror = (e) => {
                console.log('error')
                console.log(e)
                this.disconnect()
                resolve()
            }
            */

            this.pollInterval = setInterval(async () => {
                const response = await axios.get(`${this.protocol}://${this.address}/printer/objects/query?motion_report&virtual_sdcard&display_status`)
                this.store?.commit('printer/updateKlipperModelData', response.data.result.status)
            }, 250)
            this.connected = true
            resolve()
        })
    }

    disconnect(): void {
        clearInterval(this.pollInterval)
        this.pollInterval = -1
        //this.webSocket?.close()
        super.disconnect()
    }

    async downloadFile(filename: string, statusCallback: (percent: number, status: string) => void | null): Promise<string> {
        filename = filename.replace('/home/pi/gcode_files', '')
        const response = await axios.get(`${this.protocol}://${this.address}/server/files/gcodes${filename}`, {
            onDownloadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                statusCallback(percentCompleted, `Downloading ${filename}`)
            }
        })
        return response.data
    }
}
