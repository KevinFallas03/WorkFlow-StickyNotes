/*
JS File to manage Text-To-Speech functions

References:
https://dev.to/asaoluelijah/text-to-speech-in-3-lines-of-javascript-b8h
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
https://stackoverflow.com/questions/58049491/how-to-wait-until-speech-is-finished-inside-loop
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/pause

*/
const HelperTTS = {
    pointer: {
        row: 0,
        col: 1,
        currentElement: null
    },
    paused: false,
    initialized: false
}

const startTTS = () => {
    if (!HelperTTS.initialized) {
        initTTS();  
    }
    HelperTTS.pointer.row = 0;
    HelperTTS.pointer.col = 1;
    HelperTTS.pointer.currentElement = 0;
    HelperTTS.paused = true;
    togglePause(HelperTTS);
}

const initTTS = () => {
    if ('speechSynthesis' in window) {
        HelperTTS.headers = window.document.getElementById("workflow").children[0].children;
        HelperTTS.columns = window.document.getElementsByClassName("drop");

        document.addEventListener('keydown', (event) => {
            if (HelperTTS.paused || event.key === " ") {
                const foo = controlFunctions[event.key];
                if(foo !== undefined){
                    foo(HelperTTS);
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

const getNoteContent = (pointer, rows) => rows[pointer.row].children[0].value;

function* getWorkflowIter(tts) {
    const {pointer, columns} = tts;
    while (true) {
        const rows = columns[pointer.col].children;
        if (pointer.row < rows.length) {
            yield getNoteContent(pointer, rows);
        }

        if (!moveDown(tts)) {
            if (!moveRight(tts)) {
                break;
            } 
        }
        
    }
}