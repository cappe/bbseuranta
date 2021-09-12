import Vue from 'vue/dist/vue.esm'
import api from '../../utils/api';

const initialState = () => ({
    activeSubscription: null,
    permission: null,
    reg: null,
    currentUser: null,
    notifications: [],
});

const supportsNotifications = () => 'Notification' in window;
const supportsWebPush = () => 'PushManager' in window;

const getters = {
    activeSubscription: s => s.activeSubscription,
    hasActiveSubscription: s => !!s.activeSubscription,
    hasActiveEmail: s => s.currentUser && !!s.currentUser.email,
    permission: s => s.permission,
    reg: s => s.reg,
    supportsWebPush: s => supportsWebPush() && !!s.reg,
    // supportsWebPush: s => false,
    currentUser: s => s.currentUser,
    notifications: s => s.notifications,
};

const actions = {
    /**
     * @returns {Promise<PushSubscription | null>}
     */
    async getActiveSubscription({ getters: allGetters }) {
        const { reg } = allGetters;
        const subscription = await reg.pushManager.getSubscription();
        return subscription;
    },

    async registered({ commit, dispatch }, { reg }) {
        commit('SET_REG', { reg });

        const permission = await reg.pushManager.permissionState({ userVisibleOnly: true });
        commit('SET_PERMISSION', permission);

        const subscription = await reg.pushManager.getSubscription();
        if (!subscription) return;

        const isValid = await dispatch('validateSubscription', { subscription });
        if (!isValid) return;

        commit('SET_ACTIVE_SUBSCRIPTION', subscription);
    },

    /**
     * @param ctx
     * @param subscription
     * @returns {Promise<boolean>}
     */
    async validateSubscription({ commit }, { subscription }) {
        try {
            await api.get(`find_by_endpoint?endpoint=${subscription.endpoint}`);
            return true;
        } catch (e) {
            if (e.httpStatus === 404) {
                /**
                 * If not found, this subscription has been deleted from
                 * another device. Hence, we need to unsubscribe from it.
                 */
                try { await subscription.unsubscribe(); } catch (k) {}
                commit('DESTROY_CURRENT_USER');
            }

            return false;
        }
    },

    async loadUser({ commit }, id) {
        try {
            const r = await api.get(`users/${id}`);
            commit('SET_CURRENT_USER', r);
            return true;
        } catch (e) {
            return false;
        }
    },

    async updated({ commit, dispatch }, { reg }) {
        commit('SET_REG', { reg });
    },

    /**
     * @returns {Promise<*|null>}
     */
    async subscribeToPushNotifications({ dispatch }) {
        try {
            const permission = await dispatch('requestPermission');
            if (permission !== 'granted') return null;
            const subscription = await dispatch('subscribe');
            return subscription;
        } catch (e) {
            return null;
        }
    },

    /**
     * @returns {Promise<*|null>}
     */
    async unsubscribePushNotification({ dispatch }) {
        try {
            const subscription = await dispatch('getActiveSubscription');
            if (!subscription) return null;
            await dispatch('unsubscribe', { subscription });
            return subscription;
        } catch (e) {
            return null;
        }
    },

    /**
     * @param commit
     * @returns {Promise<null|"default"|"denied"|"granted">}
     */
    async requestPermission({ commit }) {
        if (!supportsNotifications) return null;

        const permission = await Notification.requestPermission();
        commit('SET_PERMISSION', permission);
        return permission;
    },

    /**
     * @returns {Promise<PushSubscriptionJSON | null>}
     * @throws Exception
     */
    async subscribe({ getters: allGetters, commit, dispatch }) {
        const { reg } = allGetters;
        const publicVapidKey = await dispatch('getPublicVapidKey');

        const pushSubscription = await reg
            .pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey: new Uint8Array(publicVapidKey),
            });

        commit('SET_ACTIVE_SUBSCRIPTION', pushSubscription);
        const subscription = pushSubscription.toJSON();

        return subscription;
    },

    /**
     * @returns {Promise<void>}
     * @throws Exception
     */
    async unsubscribe({ commit }, { subscription }) {
        await subscription.unsubscribe();
        commit('SET_ACTIVE_SUBSCRIPTION', null);
    },

    async getPublicVapidKey() {
        try {
            const r = await api.get('public_vapid_key');

            return r;
        } catch (e) {
            return null;
        }
    },

    /**
     * @returns {Promise<boolean>}
     */
    async createUser({ commit }, payload) {
        let success = false;

        try {
            const r = await api.post('users', payload);
            commit('SET_CURRENT_USER', r);
            success = true;
        } catch (e) {}

        return success;
    },

    /**
     * @returns {Promise<boolean>}
     */
    async destroyUser({ commit, getters: allGetters }) {
        const { id } = allGetters.currentUser;

        let success = false;

        try {
            await api.delete(`users/${id}`);
            commit('DESTROY_CURRENT_USER');
            success = true;
        } catch (e) {}

        return success;
    },
};

const mutations = {
    SET_ACTIVE_SUBSCRIPTION(state, subscription) {
        Vue.set(state, 'activeSubscription', subscription);
    },

    SET_PERMISSION(state, permission) {
        Vue.set(state, 'permission', permission);
    },

    SET_REG(state, { reg }) {
        Vue.set(state, 'reg', reg);
    },

    SET_CURRENT_USER(state, { data }) {
        Vue.set(state, 'currentUser', data.user);
        Vue.set(state, 'notifications', data.notifications);
    },

    DESTROY_CURRENT_USER(state) {
        Vue.set(state, 'currentUser', null);
        Vue.set(state, 'notifications', []);
    }
};

export default {
    state: initialState(),
    getters,
    actions,
    mutations,
};
