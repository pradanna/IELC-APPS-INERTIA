import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.Pusher = Pusher;

const scheme = import.meta.env.VITE_REVERB_SCHEME ?? 'http';
const host = import.meta.env.VITE_REVERB_HOST ?? window.location.hostname;
const port = import.meta.env.VITE_REVERB_PORT ?? 8080;
const key = import.meta.env.VITE_REVERB_APP_KEY;

console.log("REVERB DEBUG:", { scheme, host, port, key });

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: key,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === 'https',
    useTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
});


if (window.Echo.connector.pusher && window.Echo.connector.pusher.connection) {
    window.Echo.connector.pusher.connection.bind('state_change', (states) => {
        console.log("ECHO STATUS:", states.current);
    });
}





