import { Module } from 'vuex'
import { RootState } from '../types'
import { Tool, Viewer } from './types'
import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'
// @ts-ignore
import { ToolType } from '@sindarius/gcodeviewer'

export const getDefaultTools = (): Tool[] => {
    const toolString = localStorage.getItem('tools')
    if (toolString) {
        const results = JSON.parse(toolString)
        if (results.length !== 0) {
            return results
        }
    }
    return [new Tool('#00FFFF', 0.4, ToolType.Extruder), new Tool('#FF00FF', 0.4, ToolType.Extruder), new Tool('#FFFF00', 0.4, ToolType.Extruder), new Tool('#000000', 0.4, ToolType.Extruder), new Tool('#FFFFFF', 0.4, ToolType.Extruder)]
}

export const resetTools = (): Tool[] => {
    return [new Tool('#00FFFF', 0.4, ToolType.Extruder), new Tool('#FF00FF', 0.4, ToolType.Extruder), new Tool('#FFFF00', 0.4, ToolType.Extruder), new Tool('#000000', 0.4, ToolType.Extruder), new Tool('#FFFFFF', 0.4, ToolType.Extruder)]
}

export const getDefaultState = (): Viewer => {
    return {
        currentFileName: null,
        liveTracking: false,
        fileData: null,
        showProgress: false,
        tools: getDefaultTools(),
        reloadRequired: false,
        renderQuality: -1,
        renderMode: -1,
        lineMode: null,
        voxelMode: null,
        voxelWidth: -1,
        voxelHeight: -1,
        travelMoves: null,
        hqRender: null,
        specular: null,
        minfeedrate: null,
        minfeedcolor: null,
        maxfeedrate: null,
        maxfeedcolor: null,
        transparency: null,
        progressColor: null,
        backgroundColor: null,
        gridColor: null
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
