// @ts-ignore
import { ToolType } from '@sindarius/gcodeviewer'

export interface Viewer {
    currentFileName: string | null
    liveTracking: boolean
    fileData: string | null
    tools: Tool[]
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
