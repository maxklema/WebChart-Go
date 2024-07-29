export const DocPageJSInject = `

(function() {        
    
    const container = document.getElementById('wc_main');
    const newHTML = document.createElement("div");
    newHTML.innerHTML = "<!DOCTYPE html><div>	<Button id='saveDocument' class='button'>Save Document</Button></div><style>.button {        	background-color: #fa8552;	position: absolute;	color: white;        	font-weight: 600;        	text-decoration: none;        	outline: none;        	border: none;        	border-radius: 10px;        	padding: 5px 10px;        	font-size: 14px;    }   .button:hover {        	background-color: #c55424;    }   .button:focus {       	background-color: #c55424;    }";
    container.insertBefore(newHTML, container.firstChild);

    const button = document.getElementById('saveDocument');

    button.addEventListener('click', saveDoc);

    function saveDoc(){
        window.ReactNativeWebView.postMessage('saveDocument');
    }

    })();
    true;              
`