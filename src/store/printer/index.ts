import { Module } from 'vuex'
import { PrinterState, PrinterStateMotion } from './types'
import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

export const getDefaultState = (): PrinterState => {
    return {
        sourcemodel: {},
        model: {},
        motion: {
            X: 0,
            Y: 0,
            Z: 0
        }
    }
}

const state = getDefaultState()

export const printer: Module<PrinterState, any> = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
