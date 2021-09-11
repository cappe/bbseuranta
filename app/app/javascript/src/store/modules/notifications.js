import api from '../../utils/api';

const actions = {
    async notify() {
        try {
            await api.post('notifications');
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
