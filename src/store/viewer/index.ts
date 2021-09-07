import { Module } from 'vuex'
import { RootState } from '../types'
import { Tool, Viewer } from './types'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'
// @ts-ignore
import { ToolType } from '@sindarius/gcodeviewer'

export const getDefaultState = (): Viewer => {
    return {
        currentFileName: null,
        liveTracking: false,
        fileData: null,
        tools: [new Tool('#00FFFF', 0.4, ToolType.Extruder), new Tool('#FF00FF', 0.4, ToolType.Extruder), new Tool('#FFFFFF', 0.4, ToolType.Extruder), new Tool('#000000', 0.4, ToolType.Extruder), new Tool('#FFFFFF', 0.4, ToolType.Extruder)]
    }
}

const state = getDefaultState()

export const viewer: Module<Viewer, RootState> = {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}
