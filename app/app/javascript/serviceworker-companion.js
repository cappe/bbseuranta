import { register } from 'register-service-worker'

if (navigator.serviceWorker) {
    const emitReg = (reg) => {
        window.dispatchEvent(
            new CustomEvent('reg-updated', {
                detail: reg,
            })
        );
    }

    register('/serviceworker.js', {
        registrationOptions: { scope: './' },

        registered(registration) {
            console.log('Service worker has been registered.')
            emitReg(registration)
        },

        updated(registration) {
            console.log('New content is available; please refresh.')
            emitReg(registration)
        },

    })
}
