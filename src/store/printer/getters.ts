import { GetterTree } from 'vuex'
import { RootState } from '../types'
import { PrinterState } from './types'

export const getters: GetterTree<PrinterState, RootState> = {
    isCurrentJob(state, payload, root) {
        return state.job?.fileName === payload
    }
}
