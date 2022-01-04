/*
JS File to manage Text-To-Speech functions

References:
https://dev.to/asaoluelijah/text-to-speech-in-3-lines-of-javascript-b8h
https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key

*/


const startTTS = () => {
    if ('speechSynthesis' in window) {

        const headers = window.document.getElementById("workflow").children[0].children;
        const columns = window.document.getElementsByClassName("drop");

        const ttsStatus = {
            row: 0,
            col: 1,
            element: null,
            paused: true
        }

        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case "ArrowDown":
                    moveDown(ttsStatus, columns);
                    break;
                case "ArrowLeft":
                    moveLeft(ttsStatus);
                    break;
                case "ArrowRight":
                    moveRight(ttsStatus, columns);
                    break;
                case "ArrowUp":
                    moveUp(ttsStatus, columns);
                    break;
                case " ":
                    togglePause(ttsStatus, columns);
                    break;
            }
        });

        togglePause(ttsStatus, columns);
    }
    else{
        console.error("Speech Synthesis Not Compatible");
    }
}

const togglePause = (ttsStatus, columns) => {
    if (ttsStatus.paused) {
        ttsStatus.paused = false;
        const iter = getWorkflowIter(ttsStatus, columns);
        let res;
        while (!ttsStatus.paused) {
            res = iter.next();
            if (res.done) {
                break;
            }
            speak(res.value);
        }
    }
    else{
        ttsStatus.paused = true;
    }
}

const moveLeft = (pointer) => {
    const nextCol = pointer.col - 1;
    if(nextCol >= 0){
        pointer.col = nextCol;
        pointer.row = 0;
        return true;   
    }
    return false;
}

const moveRight = (pointer, columns) => {
    const nextCol = pointer.col + 1;
    if(nextCol < columns.length){
        pointer.col = nextCol;
        pointer.row = 0;
        return true;
    }
    return false;
}

// ! Live Changes Arent Reflected
const moveDown = (pointer, columns) => {
    const rows = columns[pointer.col].children
    // const sortedStickyNotes = [...rows].sort((a, b) => a.style["top"] - b.style["top"]);
    const nextRow = pointer.row + 1;
    if(nextRow < rows.length){
        pointer.row = nextRow;
        return true;
    }
    return false;
}

// ! Live Changes Arent Reflected
const moveUp = (pointer, columns) => {
    const rows = columns[pointer.col].children
    const nextRow = pointer.row - 1;
    if(nextRow >= 0){
        pointer.row = nextRow;
        return true;
    }
    return false;
}

const speak = (text) => {
    const speechRequest = new SpeechSynthesisUtterance();
    speechRequest.lang = "es-US";
    speechRequest.text = text;

    window.speechSynthesis.speak(speechRequest);
}

const getNoteContent = (pointer, rows) => rows[pointer.row].children[0].value;

function* getWorkflowIter(pointer, columns) {
    while (true) {
        let rows = columns[pointer.col].children;
        if (rows.length != 0) {
            yield getNoteContent(pointer, rows);
        }

        if (!moveDown(pointer, columns)) {
            if (!moveRight(pointer, columns)) {
                break;
            } 
        }
        
    }
}