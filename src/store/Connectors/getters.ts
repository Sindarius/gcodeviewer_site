import { GetterTree } from 'vuex'
import { PrinterConnection } from './types'

export const getters: GetterTree<PrinterConnection, any> = {
    isConnected(state) {
        if (state.connection !== null) {
            return state.connection.connected
        }
        return false
    }
}
