import BaseConnector from './BaseConnector'

export interface PrinterConnection {
    connection: BaseConnector
}

export class LastConnection {
    constructor(address: string, connectionType: ConnectionType) {
        this.address = address
        this.connectionType = connectionType
    }
    address = ''
    connectionType: ConnectionType = ConnectionType.rrf
}

export enum ConnectionType {
    rrf,
    klipper
}
