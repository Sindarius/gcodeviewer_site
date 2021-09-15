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
    },
    hqRender(state, payload: boolean) {
        localStorage.setItem('hqRender', `${payload}`)
        Vue.set(state, 'hqRender', payload)
    },
    specular(state, payload: boolean) {
        localStorage.setItem('specular', `${payload}`)
        Vue.set(state, 'specular', payload)
    },
    minfeedrate(state, payload: number) {
        if (payload < 0) payload = 1
        localStorage.setItem('minfeedrate', `${payload}`)
        Vue.set(state, 'minfeedrate', payload)
    },
    maxfeedrate(state, payload: number) {
        if (payload < 0) payload = 1
        localStorage.setItem('maxfeedrate', `${payload}`)
        Vue.set(state, 'maxfeedrate', payload)
    },
    minfeedcolor(state, payload: string) {
        localStorage.setItem('minfeedcolor', `${payload}`)
        Vue.set(state, 'minfeedcolor', payload)
    },
    maxfeedcolor(state, payload: string) {
        localStorage.setItem('maxfeedcolor', `${payload}`)
        Vue.set(state, 'maxfeedcolor', payload)
    },
    transparency(state, payload: boolean) {
        localStorage.setItem('transparency', `${payload}`)
        Vue.set(state, 'transparency', payload)
    },
    progressColor(state, payload: string) {
        localStorage.setItem('progressColor', payload)
        Vue.set(state, 'progressColor', payload)
    },
    backgroundColor(state, payload: string) {
        localStorage.setItem('backgroundColor', payload)
        Vue.set(state, 'backgroundColor', payload)
    },
    gridColor(state, payload: string) {
        localStorage.setItem('gridColor', payload)
        Vue.set(state, 'gridColor', payload)
    },
    fileOffset(state, payload: number) {
        localStorage.setItem('fileOffset', `${payload}`)
        Vue.set(state, 'fileOffset', payload)
    }
}
