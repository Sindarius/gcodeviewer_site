import Vue from 'vue'
import { MutationTree } from 'vuex'
import { Viewer } from './types'

export const mutations: MutationTree<Viewer> = {
    updateCurrentFile(state, payload) {
        Vue.set(state, 'currentFile', payload)
    },
    liveTracking(state, payload) {
        Vue.set(state, 'liveTracking', payload)
    }
}
