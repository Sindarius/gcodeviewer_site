import { GetterTree } from 'vuex'
import { RootState } from '../types'
import { Viewer } from './types'

function getBooleanLocalStorage(prop: any, fieldname: string): boolean {
    let result = prop
    if (result === null) {
        //Check if we have a value in local storage
        try {
            const rq = localStorage.getItem(fieldname)
            result = rq == 'true'
        } catch {
            result = false
        }
    }
    return result
}

function getNumberLocalStorage(prop: any, fieldname: string, defaultValue = 1): number {
    let result = prop
    if (result === null || result === -1) {
        //Check if we have a value in local storage
        const rq = localStorage.getItem(fieldname)
        if (rq) {
            const value = Number(rq)
            if (!isNaN(value)) result = value
        } else {
            result = defaultValue
        }
    }
    return result
}

function getColorLocalStorage(prop: any, fieldname: string, defaultValue: string): string {
    let result = prop
    if (result === null) {
        //Check if we have a value in local storage
        try {
            const rq = localStorage.getItem(fieldname)
            if (rq === null) return defaultValue
            result = rq.length > 0 ?? false ? rq : defaultValue
        } catch {
            result = defaultValue
        }
    }
    return result
}

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
        return getBooleanLocalStorage(state.lineMode, 'lineMode')
    },
    voxelMode(state) {
        return getBooleanLocalStorage(state.voxelMode, 'voxelMode')
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
    },
    hqRender(state) {
        return getBooleanLocalStorage(state.hqRender, 'hqRender')
    },
    specular(state) {
        return getBooleanLocalStorage(state.specular, 'specular')
    },
    minfeedrate(state) {
        return getNumberLocalStorage(state.minfeedrate, 'minfeedrate', 10)
    },
    maxfeedrate(state) {
        return getNumberLocalStorage(state.maxfeedrate, 'maxfeedrate', 60)
    },
    minfeedcolor(state) {
        return getColorLocalStorage(state.minfeedcolor, 'minfeedcolor', '#0000FF')
    },
    maxfeedcolor(state) {
        return getColorLocalStorage(state.maxfeedcolor, 'maxfeedcolor', '#FF0000')
    },
    transparency(state) {
        return getBooleanLocalStorage(state.transparency, 'transparency')
    },
    progressColor(state) {
        return getColorLocalStorage(state.progressColor, 'progressColor', '#00FF00')
    },
    backgroundColor(state) {
        return getColorLocalStorage(state.backgroundColor, 'backgroundColor', '#000000')
    },
    gridColor(state) {
        return getColorLocalStorage(state.gridColor, 'gridColor', '#0000FF')
    }
}
