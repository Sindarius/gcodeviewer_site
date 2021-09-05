import Vue from 'vue'
import { MutationTree } from 'vuex'
import { PrinterState, PrinterStatus } from './types'
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
        const axes = state.sourcemodel.move.axes
        const axesValues: any = {}

        for (let axesIdx = 0; axesIdx < axes.length; axesIdx++) {
            const axis = axes[axesIdx]
            switch (axis.letter) {
                case 'X':
                    axesValues.X = axis.userPosition
                    break
                case 'Y':
                    axesValues.Y = axis.userPosition
                    break
                case 'Z':
                    axesValues.Z = axis.userPosition
                    break
            }
        }
        Vue.set(state, 'motion', axesValues)

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
    clear(state, payload) {
        Vue.set(state, 'sourcemodel', {})
        Vue.set(state, 'motion', {})
        Vue.set(state, 'status', {})
    }
}
