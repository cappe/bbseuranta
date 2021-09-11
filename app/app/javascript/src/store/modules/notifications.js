import api from '../../utils/api';

const actions = {
    async notify() {
        try {
            await api.post('notifications');
        } catch (e) {}
    },
};

export default {
    actions,
};
