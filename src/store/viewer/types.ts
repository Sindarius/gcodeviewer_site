// @ts-ignore
import { ToolType } from '@sindarius/gcodeviewer'

export interface Viewer {
    currentFileName: string | null
    liveTracking: boolean
    fileData: string | null
    showProgress: boolean
    tools: Tool[]
    reloadRequired: boolean
    renderQuality: number
    renderMode: number
    lineMode: boolean | null
    voxelMode: boolean | null
    voxelWidth: number
    voxelHeight: number
    travelMoves: boolean | null
    hqRender: boolean | null
    specular: boolean | null
    minfeedrate: number | null
    minfeedcolor: string | null
    maxfeedrate: number | null
    maxfeedcolor: string | null
    transparency: boolean | null
    progressColor: boolean | null
    backgroundColor: boolean | null
    gridColor: boolean | null
    fileOffset: number | null
    g1AsExtrusion: boolean | null
    showGCodeStream: boolean | null
    perimeterOnly: boolean | null
}

export class Tool {
    constructor(color = '#00ff00', diameter = 0.4, toolType: any = ToolType.Extruder) {
        this.id = Math.random()
        this.color = color
        this.diameter = diameter
        this.toolType = toolType
    }
    id = 0
    color
    diameter
    toolType
}
