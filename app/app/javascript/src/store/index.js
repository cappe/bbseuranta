import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex';

Vue.use(Vuex);

const modules = {};
const requireModule = require.context('./modules', true, /\.js$/);

requireModule.keys().forEach((fileName) => {
    const a = fileName.split('/');

    let module = a.pop().replace(/(\.\/|\.js)/g, '');

    // Handles nested modules
    if (a.length > 1) {
        a.shift(); // Drops the first el which is the "."

        const path = a.join('/');

        module = `${path}/${module}`;
    }

    modules[module] = {
        namespaced: true,
        ...requireModule(fileName).default,
    };
});

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules,
});
