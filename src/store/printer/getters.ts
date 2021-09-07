import { GetterTree } from 'vuex'
import { RootState } from '../types'
import { PrinterState, PrinterStatus } from './types'

export const getters: GetterTree<PrinterState, RootState> = {
    isCurrentJob(state, payload) {
        return state.job?.fileName === payload
    },
    isPrinting(state) {
        return state.status === PrinterStatus.Printing || state.status === PrinterStatus.Simulating
    }
}
