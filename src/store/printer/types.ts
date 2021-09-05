export interface PrinterState {
    sourcemodel: any
    model: any
    motion?: PrinterStateMotion
    status?: PrinterStatus
}

export interface PrinterStateMotion {
    X: number
    Y: number
    Z: number
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
