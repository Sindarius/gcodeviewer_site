import Vue from 'vue'
import { MutationTree } from 'vuex'
import store from '..'
import BaseConnector from './BaseConnector'
import { LastConnection, PrinterConnection } from './types'

export const mutations: MutationTree<PrinterConnection> = {
    setConnection(state, payload: BaseConnector) {
        Vue.set(state, 'connection', payload) //store the connection in vuex
        const lastConnection = new LastConnection(payload.address, payload.connectionType)
        localStorage.setItem('lastConnection', JSON.stringify(lastConnection))
    },
    clear(state, payload) {
        Vue.set(state, 'connection', {})
    }
}
