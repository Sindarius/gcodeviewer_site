export interface PrinterState {}

export interface PrinterStateMotion {
    x: number
    y: number
    z: number
}

export interface PrinterStatePrinting {
    status: PrinterStatus
}

export enum PrinterStatus {
    Printing,
    Idle,
    Error
}
