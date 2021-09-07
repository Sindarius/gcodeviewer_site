import Vue from 'vue'
import { MutationTree } from 'vuex'
import { Axes, BuildVolume, Job, PrinterState, PrinterStatus } from './types'
import merge from 'lodash.merge'
import axios from 'axios'
import { getDefaultState } from '../connectors'

export const mutations: MutationTree<PrinterState> = {
    /****************************************************************************/
    /*  DUET */
    /****************************************************************************/

    updateDuetModelData(state, payload) {
        if (state.sourcemodel === null) {
            Vue.set(state, 'sourcemodel', {})
        }
        const result = { ...state.sourcemodel }
        merge(result, payload)
        Vue.set(state, 'sourcemodel', result)

        //Start updating our ui model
        if (state.sourcemodel === {}) return

        //get motion values
        const dwcAxes = state.sourcemodel.move.axes
        let axesValues: Axes[] = []
        axesValues = dwcAxes.map((axis: { letter: string; userPosition: number }) => new Axes(axis.letter, axis.userPosition))
        Vue.set(state, 'motion', axesValues)

        //get bed size
        let buildVolume: BuildVolume[] = []
        buildVolume = dwcAxes.map((axis: { letter: string; min: number; max: number }) => new BuildVolume(axis.letter, axis.min, axis.max))
        const match = state.buildVolume.every((value, index) => value.min === state.buildVolume[index].min && value.max === state.buildVolume[index].max)
        if (buildVolume.length != state.buildVolume.length || !match) {
            Vue.set(state, 'buildVolume', buildVolume)
        }

        //status
        let status = PrinterStatus.Unknown
        switch (state.sourcemodel.state.status) {
            case 'idle':
                status = PrinterStatus.Idle
                break
            case 'processing':
                status = PrinterStatus.Printing
                if (state.job) {
                    Vue.set(state.job, 'filePosition', state.sourcemodel.job.filePosition)
                }
                break
            case 'error':
                status = PrinterStatus.Error
                break
            case 'busy':
                status = PrinterStatus.Busy
                break
            case 'simulating':
                status = PrinterStatus.Simulating
                if (state.job) {
                    Vue.set(state.job, 'filePosition', state.sourcemodel.job.filePosition)
                }
                break
        }
        Vue.set(state, 'status', status)

        //Look for job info
        if (payload.job?.file?.fileName) {
            const job = new Job()
            job.fileName = state.sourcemodel.job?.file?.fileName ?? ''
            job.size = state.sourcemodel.job?.file.size
            job.filePosition = state.sourcemodel.job.filePosition
            job.duration = state.sourcemodel.job.duration
            Vue.set(state, 'job', job)
        }
    },
    /****************************************************************************/
    /*  KLIPPER */
    /****************************************************************************/
    updateKlipperModelData(state, payload) {
        const result = { ...state.sourcemodel }
        merge(result, payload)
        Vue.set(state, 'sourcemodel', result)

        //set config info
        if (payload.configfile?.config) {
            try {
                const buildVolume: BuildVolume[] = []
                buildVolume.push(new BuildVolume('X', Number.parseFloat(payload.configfile.config.stepper_x.position_endstop), Number.parseFloat(payload.configfile.config.stepper_x.position_max)))
                buildVolume.push(new BuildVolume('Y', Number.parseFloat(payload.configfile.config.stepper_y.position_endstop), Number.parseFloat(payload.configfile.config.stepper_y.position_max)))
                buildVolume.push(new BuildVolume('Z', Number.parseFloat(payload.configfile.config.stepper_z.position_endstop), Number.parseFloat(payload.configfile.config.stepper_z.position_max)))
                const match = state.buildVolume.every((value, index) => value.min === state.buildVolume[index].min && value.max === state.buildVolume[index].max)
                if (buildVolume.length != state.buildVolume.length || !match) {
                    Vue.set(state, 'buildVolume', buildVolume)
                }
            } catch (ex) {
                console.error(ex)
            }
        }

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

        //Update Job
        const job = new Job()
        job.fileName = state.sourcemodel.virtual_sdcard.file_path
        job.filePosition = state.sourcemodel.virtual_sdcard.file_position
        job.size = state.sourcemodel.virtual_sdcard.file_size
        Vue.set(state, 'job', job)
    },
    clear(state, payload) {
        Vue.set(state, 'sourcemodel', {})
        Vue.set(state, 'motion', {})
        Vue.set(state, 'status', {})
        Vue.set(state, 'job', {})
    }
}
