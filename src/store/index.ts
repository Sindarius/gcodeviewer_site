import Vue from 'vue'
import Vuex from 'vuex'
import { connections } from './connectors'
import { printer } from './printer'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        connections,
        printer
    }
})
