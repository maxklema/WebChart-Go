import mie from '@maxklema/mie-api-tools';

export const patientPageJSInject = `

(function() {        
    fetch('${mie.URL.value}')
    .then(response => {
        const container = document.getElementById('wc_pat_bar');
        const newHTML = document.createElement("div");
        newHTML.innerHTML = "<!DOCTYPE html><div>    <div class='button-containers'>        <Button id='contacts' class='button'>Add Patient to Contacts</Button>        <Button id='message' class='button'>Message Patient</Button>    </div></div><style>    .button-containers {        width: 100%;        display: flex;        justify-content: space-evenly;        flex-direction: row;        padding: 10px 0px;    }    .button {        background: linear-gradient(69deg, #fa8552, #d15a27);        color: white;        font-weight: 600;        text-decoration: none;        outline: none;        border: none;        border-radius: 10px;        padding: 5px 10px;        font-size: 14px;    }    .button:hover {        background-color: #c55424;    }    .button:focus {        background-color: #c55424;    }</style>";
        container.insertBefore(newHTML, container.firstChild);

        const main_container = document.getElementById('wc_main');
        const divider = document.createElement("div");
        divider.style.marginBottom = "70px";
        main_container.insertBefore(divider, main_container.firstChild);
        

        })
    })();
    true;              
`