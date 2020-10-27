import Vue from 'vue';
import VueI18n from 'vue-i18n';
import store from '@/store';
import zhLocale from './zh-CN';
import enLocale from './en';

Vue.use(VueI18n);

const messages = {
    // 简体中文
    en: {
        ...enLocale
    },
    'zh-hans': {
        ...zhLocale
    }
};
const i18n = new VueI18n({
    // set locale
    // options: en | zh | es
    locale: store.state.app.language,
    // set locale messages
    messages
});

export default i18n;
