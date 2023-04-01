import { Module } from 'vuex'
import { BuildVolume, PrinterState } from './types'
import { actions } from './actions'
import { mutations } from './mutations'
import { getters } from './getters'

export const getDefaultState = (): PrinterState => {
    return {
        sourcemodel: {},
        buildVolume: [new BuildVolume('X', 0, 235), new BuildVolume('Y', 0, 250), new BuildVolume('Z', 0, 200)]
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
