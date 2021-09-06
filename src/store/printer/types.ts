export interface PrinterState {
    sourcemodel: any
    motion?: PrinterStateMotion
    status?: PrinterStatus
    buildVolumne?: BuildVolume
}

export interface PrinterStateMotion {
    axes: Axes[]
}

export class Axes {
    constructor(axes: string, position: number) {
        this.axes = axes
        this.position = position
    }
    axes = ''
    position = 0
}

export class BuildVolume {
    constructor(axes: string, min: number, max: number) {
        this.axes = axes
        this.min = min
        this.max = max
    }
    axes = ''
    min = 0
    max = 100
}

export interface PrinterStatePrinting {
    status: PrinterStatus
}

export enum PrinterStatus {
    Unknown = 'Unknown',
    Printing = 'Printing',
    Idle = 'Idle',
    Error = 'Error',
    Busy = 'Busy',
    Simulating = 'Simulating'
}
