// Object to access control functions
const controlFunctions = {};
controlFunctions[" "] = togglePause;
controlFunctions["ArrowUp"] = moveUp;
controlFunctions["ArrowDown"] = moveDown;
controlFunctions["ArrowLeft"] = moveLeft;
controlFunctions["ArrowRight"] = moveRight;

// Functions:

function togglePause(tts) {
    if (tts.paused) {
        tts.paused = false;
        const iter = getWorkflowIter(tts);
        const playNext = () => {
            if (!tts.paused) {
                const {value, done} = iter.next();
                if (!done) {
                    speak(value)
                    .then(playNext);
                }
            }
        }
        playNext();
    }
    else{
        tts.paused = true;
        window.speechSynthesis.cancel()
    }
}

function moveLeft({pointer}) {
    const nextCol = pointer.col - 1;
    if(nextCol >= 0){
        pointer.col = nextCol;
        pointer.row = 0;
        return true;   
    }
    return false;  
}

function moveRight({pointer, columns}) {
    const nextCol = pointer.col + 1;
    if(nextCol < columns.length){
        pointer.col = nextCol;
        pointer.row = 0;
        return true;
    }
    return false;
}

// ! Live Changes Arent Reflected
function moveDown({pointer, columns}) {
    const rows = columns[pointer.col].children
    //const sortedStickyNotes = [...rows].sort((a, b) => a.style["top"] - b.style["top"]);
    const nextRow = pointer.row + 1;
    if(nextRow < rows.length){
        pointer.row = nextRow;
        return true;
    }
    return false;
}

// ! Live Changes Arent Reflected
function moveUp({pointer, columns}) {
    const rows = columns[pointer.col].children
    const nextRow = pointer.row - 1;
    if(nextRow >= 0){
        pointer.row = nextRow;
        return true;
    }
    return false;
}