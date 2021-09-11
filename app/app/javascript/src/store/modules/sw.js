import Vue from 'vue/dist/vue.esm'
import api from '../../utils/api';

const initialState = () => ({
    activeSubscription: null,
    permission: null,
    reg: null,
    currentUser: null,
});

const supportsNotifications = () => 'Notification' in window;
const supportsWebPush = () => 'PushManager' in window;

const getters = {
    activeSubscription: s => s.activeSubscription,
    hasActiveSubscription: s => !!s.activeSubscription,
    permission: s => s.permission,
    reg: s => s.reg,
    supportsWebPush: s => supportsWebPush() && !!s.reg,
    currentUser: s => s.currentUser,
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
    async validateSubscription(ctx, { subscription }) {
        try {
            await api.get(`validate_push_subscription?endpoint=${subscription.endpoint}`);
            return true;
        } catch (e) {
            if (e.httpStatus === 404) {
                /**
                 * If not found, this subscription has been deleted from
                 * another device. Hence, we need to unsubscribe from it.
                 */
                try { await subscription.unsubscribe(); } catch (k) {}
            }

            return false;
        }
    },

    async updated({ commit, dispatch }, { reg }) {
        commit('SET_REG', { reg });
    },

    /**
     * @returns {Promise<boolean>}
     */
    async subscribeToPushNotifications({ dispatch }) {
        const permission = await dispatch('requestPermission');
        if (permission !== 'granted') return false;

        let success = false;

        try {
            const subscription = await dispatch('subscribe');
            success = await dispatch('createUser', { subscription });
        } catch (e) {}

        return success;
    },

    /**
     * @returns {Promise<boolean>}
     */
    async unsubscribePushNotification({ dispatch }) {
        const subscription = await dispatch('getActiveSubscription');
        if (!subscription) return false;

        let success = false;

        try {
            success = await dispatch('destroyUser', { subscription });
            await dispatch('unsubscribe', { subscription });
        } catch (e) {}

        return success;
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
    async createUser({ commit }, { subscription }) {
        const payload = {
            user: {
                endpoint: subscription.endpoint,
                expirationTime: subscription.expirationTime,
                auth: subscription.keys.auth,
                p256dh: subscription.keys.p256dh,
                userAgent: navigator.userAgent,
            },
        };

        let success = false;

        try {
            const r = await api.post('create', payload);
            commit('SET_CURRENT_USER', r);
            success = true;
        } catch (e) {}

        return success;
    },

    /**
     * @returns {Promise<boolean>}
     */
    async destroyUser({ commit, getters: allGetters }, { subscription }) {
        const { endpoint } = allGetters.currentUser;

        if (endpoint !== subscription.endpoint) return true;

        let success = false;

        try {
            await api.delete(endpoint);
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
        Vue.set(state, 'currentUser', data);
    },

    DESTROY_CURRENT_USER(state) {
        Vue.set(state, 'currentUser', null);
    }
};

export default {
    state: initialState(),
    getters,
    actions,
    mutations,
};
