import Vue from 'vue'
import { MutationTree } from 'vuex'
import { Viewer, Tool } from './types'

export const mutations: MutationTree<Viewer> = {
    updateCurrentFile(state, payload) {
        Vue.set(state, 'currentFileName', payload)
    },
    liveTracking(state, payload: boolean) {
        Vue.set(state, 'liveTracking', payload)
    },
    saveTools(state, payload: Tool[]) {
        Vue.set(state, 'tools', payload)
        localStorage.setItem('tools', JSON.stringify(payload))
    },
    showProgress(state, payload: boolean) {
        Vue.set(state, 'showProgress', payload)
    },
    reloadRequired(state, payload: boolean) {
        Vue.set(state, 'reloadRequired', payload)
    },
    renderQuality(state, payload: number) {
        localStorage.setItem('renderQuality', `${payload}`)
        Vue.set(state, 'renderQuality', payload)
    },
    renderMode(state, payload: number) {
        localStorage.setItem('renderMode', `${payload}`)
        Vue.set(state, 'renderMode', payload)
    },
    lineMode(state, payload: boolean) {
        localStorage.setItem('lineMode', `${payload}`)
        Vue.set(state, 'lineMode', payload)
        if (payload) {
            localStorage.setItem('voxelMode', 'false')
            Vue.set(state, 'voxelMode', false)
        }
    },
    voxelMode(state, payload: boolean) {
        localStorage.setItem('voxelMode', `${payload}`)
        Vue.set(state, 'voxelMode', payload)
        if (payload) {
            localStorage.setItem('lineMode', 'false')
            Vue.set(state, 'lineMode', false)
        }
    },
    voxelWidth(state, payload: number) {
        if (payload < 0) payload = 1
        localStorage.setItem('voxelWidth', `${payload}`)
        Vue.set(state, 'voxelWidth', payload)
    },
    voxelHeight(state, payload: number) {
        if (payload < 0) payload = 1
        localStorage.setItem('voxelHeight', `${payload}`)
        Vue.set(state, 'voxelHeight', payload)
    },
    travelMoves(state, payload: number) {
        localStorage.setItem('travelMoves', `${payload}`)
        Vue.set(state, 'travelMoves', payload)
    }
}
