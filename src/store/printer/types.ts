export interface PrinterState {
    sourcemodel: any
    buildVolume: BuildVolume[]
    motion?: PrinterStateMotion
    status?: PrinterStatus
    job?: Job
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

export class Job {
    filePosition? = 0
    duration? = 0
    fileName? = ''
    size? = 0
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
