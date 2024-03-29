export default {
    language: 'English',
    default: {
        save: 'Save',
        cancel: 'Cancel',
        reset: 'Reset',
        default: 'Default'
    },
    $vuetify: {
        badge: 'Badge',
        close: 'Close',
        dataIterator: {
            noResultsText: 'No matching records found',
            loadingText: 'Loading items...'
        },
        dataTable: {
            itemsPerPageText: 'Rows per page:',
            ariaLabel: {
                sortDescending: 'Sorted descending.',
                sortAscending: 'Sorted ascending.',
                sortNone: 'Not sorted.',
                activateNone: 'Activate to remove sorting.',
                activateDescending: 'Activate to sort descending.',
                activateAscending: 'Activate to sort ascending.'
            },
            sortBy: 'Sort by'
        },
        dataFooter: {
            itemsPerPageText: 'Items per page:',
            itemsPerPageAll: 'All',
            nextPage: 'Next page',
            prevPage: 'Previous page',
            firstPage: 'First page',
            lastPage: 'Last page',
            pageText: '{0}-{1} of {2}'
        },
        datePicker: {
            itemsSelected: '{0} selected'
        },
        noDataText: 'No data available',
        carousel: {
            prev: 'Previous visual',
            next: 'Next visual',
            ariaLabel: {
                delimiter: 'Carousel slide {0} of {1}'
            }
        },
        calendar: {
            moreEvents: '{0} more'
        },
        fileInput: {
            counter: '{0} files',
            counterSize: '{0} files ({1} in total)'
        },
        timePicker: {
            am: 'AM',
            pm: 'PM'
        }
    },
    viewer: {
        tools: {
            title: 'Tools',
            tool: 'Tool|Tools',
            quantity: 'Quantity',
            qtyerror: 'The number of tools must be between 1 and 10'
        },
        toolbar: {
            toolstitle: 'Edit Tools',
            openlocal: 'Open Local File\nDrag/Drop on Viewer',
            reloadViewer: 'Reload Viewer',
            resetCamera: 'Reset Camera',
            liveTrack: 'Live Track Print'
        },
        settings: {
            hqrender: 'HQ Rendering (Round Extrusions)',
            minfeedrate: 'Min Feed Rate',
            maxfeedrate: 'Max Feed Rate',
            voxelHeight: 'Voxel Height',
            voxelWidth: 'Voxel Width',
            useSpecular: 'Specular Lighting',
            transparency: 'Transparency',
            forceLineMode: 'Force Line Mode',
            voxelMode: 'Voxel Mode (ASMBL)',
            fileOffset: 'File Offset',
            g1AsExtrusion: 'G1 As Extrusion (CNC)',
            showGCodeStream: 'Show GCode Stream',
            perimeterOnly: 'Perimeter Only',
            zBelt: 'Z Belt',
            zBeltAngle: 'Z Belt Gantry Angle',
            showNozzle: 'Show Nozzle',
            showBed: 'Show Bed',
            showAxis: 'Show Axes'
        }
    }
}
