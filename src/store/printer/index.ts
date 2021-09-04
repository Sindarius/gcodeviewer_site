import { Module } from 'vuex'
import { PrinterState } from './types'
import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

export const getDefaultState = (): PrinterState => {
    return {}
}

const state = getDefaultState()

export const printer: Module<PrinterState, any> = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}
