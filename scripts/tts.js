/*
JS File to manage Text-To-Speech functions

References:
https://dev.to/asaoluelijah/text-to-speech-in-3-lines-of-javascript-b8h
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
https://stackoverflow.com/questions/58049491/how-to-wait-until-speech-is-finished-inside-loop
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/pause

*/
 const STATE_LABEL = "Estado";
const HelperTTS = {
    pointer: {
        row: 0,
        col: 0,
        currentElement: () => HelperTTS.columns[HelperTTS.pointer.col].children[HelperTTS.pointer.row]
    },
    paused: false,
    initialized: false,
    blockKeys: false,
    headers: null,
    columns: null
}

const startTTS = () => {
    if (!HelperTTS.initialized) {
        initTTS();  
    }
    HelperTTS.pointer.row = 0;
    HelperTTS.pointer.col = 0; 
    if (moveRight(HelperTTS)) { // workflow not empty
        HelperTTS.paused = true;
        HelperTTS.blockKeys = false;
        togglePause(HelperTTS);
    }
}

const initTTS = () => {
    if ('speechSynthesis' in window) {
        HelperTTS.headers = window.document.getElementById("workflow").children[0].children[0].children;
        HelperTTS.columns = window.document.getElementsByClassName("drop");

        document.addEventListener('keydown', (event) => {
            if (!HelperTTS.blockKeys) {
                if (HelperTTS.paused || event.key === " ") {
                    const foo = controlFunctions[event.key];
                    if(foo !== undefined){
                        foo(HelperTTS);
                    }
                }    
            }
        });
    }
    else{
        console.error("Speech Synthesis Not Compatible");
    }
}

// Returns a Promise that resolves when audio ends
const speak = (text) => {
    const speechRequest = new SpeechSynthesisUtterance();
    speechRequest.lang = "es-US";
    speechRequest.text = text;
    window.speechSynthesis.speak(speechRequest);
    return new Promise(resolve => speechRequest.onend = resolve);
}

const getNoteTTS = ({pointer, columns, headers}) => {
    const content = columns[pointer.col].children[pointer.row].children[0].value;
    const header = headers[pointer.col].textContent;

    return `${content}. ${STATE_LABEL}: ${header}. `
}

function* getWorkflowIter(tts) {
    const {pointer, columns} = tts;
    while (true) {
        const rows = columns[pointer.col].children;
        if (pointer.row < rows.length) {
            yield getNoteTTS(tts);
        }

        if (!moveDown(tts)) {
            if (!moveRight(tts)) {
                break;
            } 
        }
        
    }
}