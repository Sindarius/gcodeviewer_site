import Vue from 'vue'
import { MutationTree } from 'vuex'
import { PrinterState } from './types'

export const mutations: MutationTree<PrinterState> = {
    updateDuetModelData(state, payload) {
        console.log('a')
        if (state.model === null) {
            console.log('a1')
            Vue.set(state, 'sourcemodel', {})
        }
        console.log('b')
        const result = { ...state.model, ...payload }
        console.log(result)
        console.log('c')
        Vue.set(state, 'sourcemodel', result)
        console.log('d')
    }
}
