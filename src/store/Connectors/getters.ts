import { GetterTree } from 'vuex'
import { LastConnection, PrinterConnection } from './types'

export const getters: GetterTree<PrinterConnection, any> = {
    isConnected(state) {
        if (state.connection !== null) {
            return state.connection.connected
        }
        return false
    },
    getLastConnection(): LastConnection | null {
        const lastConn = localStorage.getItem('lastConnection')
        if (lastConn) return JSON.parse(lastConn)
        return null
    }
}
