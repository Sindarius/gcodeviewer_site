import { PrinterState } from '@/store/printer/types'
import { Viewer } from './viewer/types'

export interface RootState {
    printer?: PrinterState
    viewer?: Viewer
}
