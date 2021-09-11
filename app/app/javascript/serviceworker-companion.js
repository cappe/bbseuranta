import { register } from 'register-service-worker'

if (navigator.serviceWorker) {
    register('/serviceworker.js', {
        registrationOptions: { scope: './' },
    })
}
