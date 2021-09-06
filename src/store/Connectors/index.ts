import { Module } from 'vuex'
import BaseConnector from './BaseConnector'
import { PrinterConnection } from './types'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'

export const getDefaultState = (): PrinterConnection => {
    return {
        connection: new BaseConnector(null)
    }
}

const state = getDefaultState()

export const connections: Module<PrinterConnection, any> = {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
