<template>
    <div ref="view" class="codeview" @mouseup="mouseUp" @keydown="keyPress" @keypress="keyPress"></div>
</template>

<style scoped></style>

<style>
.cm-activeLine {
    background-color: #333 !important;
}

.codeview {
    height: 100%;
    overflow: auto;
}
</style>

<script lang="ts">
import { Component, PropSync, Prop, Vue, Watch } from 'vue-property-decorator'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'

@Component({})
export default class CodeStream extends Vue {
    @PropSync('currentline') currentLineNumber!: number
    @Prop({ type: String, default: '' }) declare document: string
    @Prop({ type: Boolean, default: false }) declare isSimulating: boolean
    @Prop({ type: Boolean, default: false }) declare shown: boolean

    view: EditorView | undefined = undefined

    private mounted() {
        this.view = new EditorView({
            doc: this.document,
            extensions: [basicSetup, EditorState.readOnly.of(true)],
            parent: this.$refs['view'] as HTMLElement
        })
    }

    mouseUp() {
        if (this.view) {
            const line = this.view.state.doc.lineAt(this.view.state.selection.ranges[0].from)
            this.$emit('updated', line.to)
            this.view.contentDOM.blur()
            this.$emit('got-focus')
        }
    }

    keyPress() {
        if (this.view) {
            const line = this.view.state.doc.lineAt(this.view.state.selection.ranges[0].from)
            this.$emit('updated', line.to)
            this.$emit('got-focus')
        }
    }

    @Watch('document') documentUpdated() {
        if (this.view && this.shown) {
            this.view.dispatch({
                changes: {
                    from: 0,
                    to: this.view.state.doc.length,
                    insert: this.document
                }
            })
        }
    }

    @Watch('currentline') currentlineUpdated(to: number) {
        if (this.view && this.shown) {
            const line = this.view.state.doc.lineAt(to)
            this.view.dispatch({
                selection: {
                    anchor: line.from,
                    head: line.from
                },
                scrollIntoView: true
            })
        }
    }
}
</script>
