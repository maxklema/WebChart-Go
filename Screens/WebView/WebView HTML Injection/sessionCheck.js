import mie from '@maxklema/mie-api-tools-lite';

export const sessionCheck = `

(function() {        
    fetch('${mie.URL.value}')
    .then(response => {
        window.ReactNativeWebView.postMessage(response.headers.get('x-lg_session_id'));
        })
    })();
    true;              
`