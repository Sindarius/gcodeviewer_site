import Vue from 'vue'
import { MutationTree } from 'vuex'
import { Axes, BuildVolume, PrinterState, PrinterStatus } from './types'
import merge from 'lodash.merge'

export const mutations: MutationTree<PrinterState> = {
    updateDuetModelData(state, payload) {
        if (state.sourcemodel === null) {
            Vue.set(state, 'sourcemodel', {})
        }
        const result = { ...state.sourcemodel }
        merge(result, payload)
        Vue.set(state, 'sourcemodel', result)

        //Start updating our ui model

        //get motion values
        const dwcAxes = state.sourcemodel.move.axes
        let axesValues: Axes[] = []
        axesValues = dwcAxes.map((axis: { letter: string; userPosition: number }) => new Axes(axis.letter, axis.userPosition))
        Vue.set(state, 'motion', axesValues)

        let buildVolume: BuildVolume[] = []
        buildVolume = dwcAxes.map((axis: { letter: string; min: number; max: number }) => new BuildVolume(axis.letter, axis.min, axis.max))
        Vue.set(state, 'buildVolume', buildVolume)

        //get bed size

        //status
        let status = PrinterStatus.Unknown
        switch (state.sourcemodel.state.status) {
            case 'idle':
                status = PrinterStatus.Idle
                break
            case 'processing':
                status = PrinterStatus.Printing
                break
            case 'error':
                status = PrinterStatus.Error
                break
            case 'busy':
                status = PrinterStatus.Busy
                break
            case 'simulating':
                status = PrinterStatus.Simulating
                break
        }
        Vue.set(state, 'status', status)
    },
    updateKlipperModelData(state, payload) {
        const result = { ...state.sourcemodel }
        merge(result, payload)
        Vue.set(state, 'sourcemodel', result)

        //Set the status
        let status = PrinterStatus.Unknown
        if (state.sourcemodel.virtual_sdcard.is_active) {
            status = PrinterStatus.Printing
        } else {
            status = PrinterStatus.Idle
        }
        Vue.set(state, 'status', status)
        const axesValues: Axes[] = []
        axesValues.push(new Axes('X', state.sourcemodel.motion_report.live_position[0]))
        axesValues.push(new Axes('Y', state.sourcemodel.motion_report.live_position[1]))
        axesValues.push(new Axes('Z', state.sourcemodel.motion_report.live_position[2]))
        Vue.set(state, 'motion', axesValues)
    },
    clear(state, payload) {
        Vue.set(state, 'sourcemodel', {})
        Vue.set(state, 'motion', {})
        Vue.set(state, 'status', {})
    }
}
