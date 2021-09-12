import api from '../../utils/api';

const actions = {
    async notify({ rootGetters }) {
        const user_id = rootGetters['sw/currentUser'].id;
        try {
            await api.post('notifications', { user_id });
        } catch (e) {}
    },

    async readAll(ctx, notificationIds) {
        try {
            await api.update('notifications/batch_update', notificationIds);
        } catch (e) {}
    }
};

export default {
    actions,
};
