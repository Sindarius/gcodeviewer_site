import axios from 'axios'
import BaseConnector from './BaseConnector'
import { ConnectionType } from './types'

export default class OctoPrintConnector extends BaseConnector {
    connectionType = ConnectionType.octoprint
    connection_id = ''
    pollInterval = -1
    apiHeader = {}

    constructor(store: any) {
        super(store)
    }

    //Use the Password for API Key if specified
    async connect(address: string, password = '', protocol = 'http'): Promise<void> {
        this.address = address
        this.password = password
        const apiKey = password
        this.apiHeader = {}
        const apiString = ''

        //going to need an error message for failed connections to make it to the UI with details

        if (!this.address.includes(':')) {
            //this.address += ':7125' //Default moonraker port
        }

        if (apiKey) {
            this.apiHeader = {
                'Content-Type': 'text/plain',
                'X-Api-Key': apiKey,
                Accept: 'text/plain'
            }
        }

        const stats = await axios.get(`${this.protocol}://${this.address}/api/printerprofiles`, { headers: this.apiHeader, data: {} })
        this.store?.commit('printer/updateOctoPrintModelData', stats.data)

        return new Promise((resolve) => {
            this.pollInterval = setInterval(async () => {
                const response = await axios.get(`${this.protocol}://${this.address}/api/job`, { headers: this.apiHeader, data: {} })
                this.store?.commit('printer/updateOctoPrintModelData', response.data)
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

    stopPolling(): void {
        clearInterval(this.pollInterval)
    }

    startPolling(): void {
        this.pollInterval = setInterval(async () => {
            const response = await axios.get(`${this.protocol}://${this.address}/api/job`, { headers: this.apiHeader, data: {} })
            this.store?.commit('printer/updateOctoPrintModelData', response.data)
        }, 250)
    }

    async downloadFile(filename: string, statusCallback: (percent: number, status: string) => void | null): Promise<string> {
        this.stopPolling()
        try {
            const getFileInfo = await axios.get(`${this.protocol}://${this.address}/api/files/local/${filename}`, { headers: this.apiHeader, data: {} })
            const fileUrl = getFileInfo.data.refs.download

            const response = await axios.get(`${fileUrl}`, {
                headers: this.apiHeader,
                responseType: 'text',
                data: {},
                onDownloadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total) / 100
                    statusCallback(percentCompleted, `Downloading ${filename}`)
                }
            })
            return response.data
        } catch (ex) {
            console.error(ex)
        } finally {
            this.startPolling()
        }
        return Promise.reject(`Could not download file ${filename}`)
    }
}
