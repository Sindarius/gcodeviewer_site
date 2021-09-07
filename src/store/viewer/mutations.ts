import Vue from 'vue'
import { MutationTree } from 'vuex'
import { Viewer, Tool } from './types'

export const mutations: MutationTree<Viewer> = {
    updateCurrentFile(state, payload) {
        Vue.set(state, 'currentFile', payload)
    },
    liveTracking(state, payload) {
        Vue.set(state, 'liveTracking', payload)
    },
    saveTools(state, payload: Tool[]) {
        Vue.set(state, 'tools', payload)
        localStorage.setItem('tools', JSON.stringify(payload))
    },
    showProgress(state, payload: boolean) {
        Vue.set(state, 'showProgress', payload)
    }
}
