import Vue from 'vue';
import Vuex from 'vuex';
import modules from '@/store/modules';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
    getters,
    modules
});

export default store;
