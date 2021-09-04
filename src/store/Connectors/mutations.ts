import Vue from 'vue'
import { MutationTree } from 'vuex'
import BaseConnector from './BaseConnector'
import { PrinterConnection } from './types'

export const mutations: MutationTree<PrinterConnection> = {
    SetCnnection(state, payload: BaseConnector) {
        Vue.set(state, 'connection', payload) //store the connection in vuex
    }
}
