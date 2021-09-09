import { GetterTree } from 'vuex'
import { RootState } from '../types'
import { Viewer } from './types'

export const getters: GetterTree<Viewer, RootState> = {
    renderQuality(state) {
        let result = state.renderQuality
        if (result === -1) {
            //Check if we have a value in local storage
            const rq = localStorage.getItem('renderQuality')
            if (rq) {
                const value = Number(rq)
                if (!isNaN(value)) result = value
            } else {
                result = 1
            }
        }
        return result
    },
    renderMode(state) {
        let result = state.renderMode
        if (result === -1) {
            //Check if we have a value in local storage
            const rq = localStorage.getItem('renderMode')
            if (rq) {
                const value = Number(rq)
                if (!isNaN(value)) result = value
            } else {
                result = 3
            }
        }
        return result
    },
    lineMode(state) {
        let result = state.lineMode
        if (result === null) {
            //Check if we have a value in local storage
            try {
                const rq = localStorage.getItem('lineMode')
                result = rq == 'true'
            } catch {
                result = false
            }
        }

        return result
    },
    voxelMode(state) {
        let result = state.voxelMode
        if (result === null) {
            //Check if we have a value in local storage
            try {
                const rq = localStorage.getItem('voxelMode')
                result = rq == 'true'
            } catch {
                result = false
            }
        }

        return result
    },
    voxelWidth(state) {
        let result = state.voxelWidth
        if (result === -1) {
            //Check if we have a value in local storage
            const rq = localStorage.getItem('voxelWidth')
            if (rq) {
                const value = Number(rq)
                if (!isNaN(value)) result = value
            } else {
                result = 1
            }
        }
        return result
    },
    voxelHeight(state) {
        let result = state.renderMode
        if (result === -1) {
            //Check if we have a value in local storage
            const rq = localStorage.getItem('voxelHeight')
            if (rq) {
                const value = Number(rq)
                if (!isNaN(value)) result = value
            } else {
                result = 1
            }
        }
        return result
    },
    travelMoves(state) {
        let result = state.travelMoves
        if (result === null) {
            //Check if we have a value in local storage
            try {
                const rq = localStorage.getItem('travelMoves')
                result = rq == 'true'
            } catch {
                result = false
            }
        }
        return result
    }
}
