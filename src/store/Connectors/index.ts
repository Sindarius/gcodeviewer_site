import { Module } from 'vuex'
import { PrinterStatus } from '../printer/types'
import BaseConnector from './BaseConnector'
import { PrinterConnection } from './types'
import { mutations } from './mutations'
import { getters } from './getters'

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
    getters
}
