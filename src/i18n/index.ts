import Vue from 'vue'
import VueI18n from 'vue-i18n'

// @ts-ignore
import en from './en.js'

Vue.use(VueI18n)

const messages = Vue.observable({
    en
})

export default new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages
})
