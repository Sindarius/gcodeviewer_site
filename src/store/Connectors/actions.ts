import { ActionTree } from 'vuex'
import { RootState } from '../types'
import { PrinterConnection } from './types'

export const actions: ActionTree<PrinterConnection, RootState> = {
    async download({ state }, payload: { filename: string; callback: (status: number) => void }): Promise<string | null> {
        if (state.connection !== null && state.connection.connected) {
            const file = await state.connection.downloadFile(payload.filename, payload.callback)
            return file
        }
        return null
    }
}
