import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from '@/i18n'

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue()

new Vue({
    store,
    render: (h) => h(App),
    vuetify,
    i18n
}).$mount('#app')
