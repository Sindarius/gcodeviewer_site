import { Module } from 'vuex'
import { RootState } from '../types'
import { Viewer } from './types'
import { mutations } from './mutations'
import { getters } from './getters'

export const getDefaultState = (): Viewer => {
    return {
        currentFileName: null,
        liveTracking: false,
        fileData: null
    }
}

const state = getDefaultState()

export const viewer: Module<Viewer, RootState> = {
    namespaced: true,
    state,
    mutations,
    getters
}
