export const patientPageJSInject = `
(function() {
        setTimeout(() => {
            const container = document.getElementById('wc_pat_bar');
            const newHTML = document.createElement("div");
            newHTML.innerHTML = "<!DOCTYPE html><div>    <div class='button-containers'>        <Button id='contacts' class='button'>&#x2b; Add Patient to Contacts</Button>        <Button id='message' class='button'>Message Patient</Button>    </div></div><style>    .button-containers {        width: 100%;        display: flex;        justify-content: space-evenly;        flex-direction: row;        padding: 10px 0px;    }    .button {        background-color: #fa8552;        color: white;        font-weight: 600;        text-decoration: none;        outline: none;        border: none;        border-radius: 10px;        padding: 5px 10px;        font-size: 14px;    }    .button:hover {        background-color: #c55424;    }    .button:focus {        background-color: #c55424;    }</style>";
            container.insertBefore(newHTML, container.firstChild);

            let contacts = document.getElementById('contacts');
            let message = document.getElementById('message');

            contacts.addEventListener('click', getContacts);
            message.addEventListener('click', sendMessage);

            function getContacts() {
                window.ReactNativeWebView.postMessage('getContacts');
            }

            function sendMessage() {
                window.ReactNativeWebView.postMessage('sendMessage');
            }
        }, 10)        
        
    })();
    true;              
`