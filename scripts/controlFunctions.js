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

function moveLeft(tts) {
    const {pointer, columns} = tts;
    let nextCol = pointer.col - 1;
    while (nextCol >= 0) {
        if(columns[nextCol].children.length > 0){
            pointer.col = nextCol;
            pointer.row = 0;
            moveDown(tts)
            console.log(pointer);
            return true;
        }
        nextCol--;
    }
    return false;
}

function moveRight(tts) {
    const {pointer, columns} = tts;
    let nextCol = pointer.col + 1;
    while (nextCol < columns.length) {
        if(columns[nextCol].children.length > 0){
            pointer.col = nextCol;
            pointer.row = -1;
            moveDown(tts)
            console.log(pointer);


            return true;
        }
        nextCol++;
    }
    return false;
}

function moveDown({pointer, columns}) {
    const rows = [...columns[pointer.col].children]
    const sortedRows = [...rows].sort((a, b) => parseInt(a.style["top"], 10) - parseInt(b.style["top"], 10));
    console.log(sortedRows == rows);
    
    // Checks Dynamically for Changes In Workflow 
    let sortedRow = sortedRows.findIndex((e) => e == pointer.currentElement());

    const nextSortedRow = sortedRow + 1;
    if(nextSortedRow < sortedRows.length){
        pointer.row = rows.findIndex((e) => e == sortedRows[nextSortedRow]);;
        console.log(pointer);
        return true;
    }
    return false;
}

function moveUp({pointer, columns}) {
    const rows = [...columns[pointer.col].children]
    const sortedRows = [...rows].sort((a, b) => parseInt(a.style["top"], 10) - parseInt(b.style["top"], 10));
    
    // Checks Dynamically for Changes In Workflow 
    let sortedRow = sortedRows.findIndex((e) => e == pointer.currentElement());

    const nextSortedRow = sortedRow - 1;
    if(nextSortedRow >= 0){
        pointer.row = rows.findIndex((e) => e == sortedRows[nextSortedRow]);;
        console.log(pointer);
        return true;
    }
    return false;
}