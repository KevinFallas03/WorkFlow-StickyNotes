var data = [{}]

window.onload = () => {
    get_workflows();
    if(window.localStorage.getItem("currentWorkflow") !== null){
        get_workflow();
        document.getElementById("tools").style.display = "block";
        let miniPointer = window.localStorage.getItem("miniPointer");
        if(miniPointer !== null){
            miniPointer = JSON.parse(miniPointer);
            initTTS();
            HelperTTS.paused = true;
            HelperTTS.pointer.col = miniPointer.col;
            HelperTTS.pointer.row = miniPointer.rowl; 
        }
    }else{
        document.getElementById("tools").style.display = "none";
    }
}
// WORKFLOW FUNCTIONS
function workflows_request() {
    var url = "/backend/workflows/get_workflows.php";
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = eval("(" + xhttp.responseText + ")");
            if (response[0] == false) {
                console.log(response[0].error);
            }
            else {
                data = response;
            }
        }
        else {
            console.log({ "status": this.status, "state": this.readyState })
        }
    };
    xhttp.open("GET", url, false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

function get_workflows() {
    workflows_request();
    data.forEach(element => {create_workflow_on_httml(element)})
}

function get_workflow() {
    var workflow_id = window.localStorage.getItem("currentWorkflow");
    var url = "/backend/workflows/get_workflow.php?workflow_id=" + workflow_id;
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, false);

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = eval("(" + xhttp.responseText + ")");
            if (response[0] === false) {
                console.log(response[0].error);
            }
            else {
                build_workflow(response);
                get_sticky_notes();
            }
        }
        else {
            console.log({ "status": this.status, "state": this.readyState })
        }
    };
    xhttp.send();
}

function create_workflow_on_httml(element) {
    var workflow = document.createElement("div");
    workflow.className = "workflow-item";
    workflow.setAttribute("id", element.id);
    workflow.setAttribute("name", "workflow" + element.id);

    var delete_button = document.createElement("div");
    delete_button.setAttribute("id", "delete_button" + element.id);
    delete_button.className = "crud-btn";
    var delete_icon = document.createElement("i");
    delete_icon.className = "fa fa-trash";
    delete_button.appendChild(delete_icon);

    var edit_button = document.createElement("div");
    edit_button.setAttribute("id", "edit_button" + element.id);
    edit_button.className = "crud-btn";
    var edit_icon = document.createElement("i");
    edit_icon.className = "fas fa-pencil-alt";
    edit_button.appendChild(edit_icon);

    var info_button = document.createElement("div");
    info_button.setAttribute("id", "info_button" + element.id);
    info_button.className = "crud-btn";
    var info_icon = document.createElement("i");
    info_icon.className = "fa fa-info-circle";
    info_button.appendChild(info_icon);

    var workflow_clickable = document.createElement("div");
    workflow_clickable.setAttribute("id", "wf_clickable" + element.id);
    workflow_clickable.className = "wf-clickable";
    workflow_clickable.innerHTML = element.name;

    delete_button.onclick = () => {
        workflow_to_delete = document.getElementsByName("workflow" + element.id);
        delete_workflow(workflow_to_delete[0]); // always in 0 because the element returned is unique
    };

    edit_button.onclick = () => {
        alert("Editing workflow");
        element.name = prompt("Name ", element.name);
        element.description = prompt("Description", element.description);
        edit_workflow_data(element.id, element.name, element.description);
    };

    info_button.onclick = () => {
        alert("Workflow " + element.id + ": " + element.name
            + "\nDescription: " + element.description
            + "\nCreation date: " + element.creation_date);
    };

    workflow_clickable.onclick = () => {
        window.localStorage.setItem("currentWorkflow", element.id);
        const {row, col} = HelperTTS.pointer;
        window.localStorage.setItem("miniPointer", {row, col});
        get_workflow();
        document.getElementById("tools").style.display = "block";
    }

    workflow.appendChild(workflow_clickable);
    workflow.appendChild(delete_button);
    workflow.appendChild(edit_button);
    workflow.appendChild(info_button);

    document.getElementById("workflow-list-id").appendChild(workflow);
}

function edit_workflow_data(workflow_id, name, description) {
    var url = "/backend/workflows/edit_workflow_data.php";
    var params = new FormData();
    params.append("workflow_id", workflow_id);
    params.append("name", name);
    params.append("description", description);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, false);
    // xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = eval ("("+xhttp.responseText+")");
            if (response[0] == false) {
                console.log(response[0].error);
            } else {
                window.location = "index.html";
            }
        }
        else {
            console.log({ "status": this.status, "state": this.readyState })
        }
    };

    xhttp.send(params);
}

function new_workflow() {
    var name = prompt("Enter workflow's name: ");
    var description = prompt("Enter workflow's description: ");

    post_workflow(name, description);
}

function post_workflow(name, description) {
    var url = "/backend/workflows/create_workflow.php"
    var xhttp = new XMLHttpRequest();

    var params = new FormData();
    params.append("name", name);
    params.append("description", description);

    xhttp.open("POST", url, false);

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = eval("(" + xhttp.responseText + ")");

            if (response[0] == false) {
                console.log(response[0].error);
            } else {
                alert("Workflow added");
                window.location = "index.html"
            }
        } else {
            console.log({ 'status': this.status, 'state': this.readyState });
        }
    };


    xhttp.send(params);
}

function delete_workflow(workflow) {
    var url = "/backend/workflows/delete_workflow.php";

    var params = new FormData();
    params.append("workflow_id", workflow.id);

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url);
    // xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(params);

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = eval ("("+xhttp.responseText+")");
            if (response[0] == false) {
                console.log(response[0].error);
            } else {
                window.location = "index.html";
            }
        } else {
            console.log({ "status": this.status, "state": this.readyState })
        }
    };
}

function build_workflow(states) {
    var headers = document.getElementById("workflow_headers");
    var columns = document.getElementById("workflow_states");
    headers.innerHTML = "";
    columns.innerHTML = "";
    states.forEach((state) => {
        headers.innerHTML += `<th id="${state.position}" name="state_${state.id}">${state.name}
                                    <br>
                                    <div>
                                        <div class="workflow-btns">
                                            <i class="fas fa-arrow-circle-left" onclick="move_left('${state.id}')"></i>
                                        </div>
                                        <div class="workflow-btns" onclick="delete_status('${state.id}')">
                                            <i class="far fa-times-circle"></i>
                                        </div>
                                        <div class="workflow-btns" onclick="create_status('${state.id}')">
                                            <i class="far fa-plus-square"></i>
                                        </div>
                                        <div class="workflow-btns" onclick="move_right('${state.id}')">
                                            <i class="fas fa-arrow-circle-right"></i>
                                        </div>
                                    </div>
                                </th>`
        columns.innerHTML += `<td id="${state.position}" name = "statebody_${state.id}"></td>`
    })

    var current_workflow = data.find((workflow) => {
        return parseInt(workflow.id, 10) === parseInt(window.localStorage.getItem("currentWorkflow"), 10);
    })
    var info_container = document.getElementsByClassName("workflow_info")[0];
    info_container.innerHTML = `<div style="border-style: groove; padding:3px ">
                                    <h2>${current_workflow.name}:</h2>
                                    <p>${current_workflow.description}</p>
                                    <p>${current_workflow.creation_date}</p>
                                </div>`
}

// STATES FUNCTIONS
function move_right(id) {
    var header = document.getElementsByName("state_" + id)[0];
    var column = document.getElementsByName("statebody_" + id)[0];

    var headers = document.getElementById('workflow_headers');
    var body = document.getElementById('workflow_states');

    var temp_id = column.id;
    column.id = column.nextElementSibling.id;
    column.nextElementSibling.id = temp_id;

    for (let i = 0; i < column.children.length; i++) {
        var left = parseInt(column.children[i].style.left.slice(0, -2));
        column.children[i].style.left = (left + 120) + 'px';
    }

    for (let i = 0; i < column.nextElementSibling.children.length; i++) {
        var left = parseInt(column.nextElementSibling.children[i].style.left.slice(0, -2));
        column.nextElementSibling.children[i].style.left = (left - 120) + 'px';
    }

    update_position(column);
    update_position(column.nextElementSibling);

    headers.insertBefore(header, header.nextElementSibling.nextElementSibling);
    body.insertBefore(column, column.nextElementSibling.nextElementSibling);
}

function move_left(id) {
    var header = document.getElementsByName("state_" + id)[0];
    var column = document.getElementsByName("statebody_" + id)[0];

    var headers = document.getElementById('workflow_headers');
    var body = document.getElementById('workflow_states');

    headers.insertBefore(header, header.previousElementSibling);
    body.insertBefore(column, column.previousElementSibling);

    var temp_id = column.id;
    column.id = column.nextElementSibling.id;
    column.nextElementSibling.id = temp_id;

    for (let i = 0; i < column.children.length; i++) {
        var left = parseInt(column.children[i].style.left.slice(0, -2));
        column.children[i].style.left = (left - 120) + 'px';
    }

    for (let i = 0; i < column.nextElementSibling.children.length; i++) {
        var left = parseInt(column.nextElementSibling.children[i].style.left.slice(0, -2));
        column.nextElementSibling.children[i].style.left = (left + 120) + 'px';
    }

    update_position(column);
    update_position(column.nextElementSibling);
}

function delete_status(id) {
    backend_delete_state(id);
    
    var header = document.getElementsByName("state_"+id)[0];
    var column = document.getElementsByName("statebody_"+id)[0];

    update_positions(header);
    update_positions(column);

    header.remove();
    column.remove();

}

function backend_delete_state(state_id){
    var url = "/backend/states/delete_state.php";

    var parameters = new FormData();
    parameters.append("state_id", state_id);

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, false);

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            console.log(xhttp.responseText);
            response = eval(`(${xhttp.responseText})`)
            if (response[0] == false){
                console.log(response[0].error);
            } else {
                console.log(response[0]);
            }
        }
        else {
            console.log({ "status": this.status, "state": this.readyState });
        }
    };

    xhttp.send(parameters);
}

function create_status(id) {
    var header = document.getElementsByName("state_" + id)[0];
    var column = document.getElementsByName("statebody_" + id)[0];

    var headers = document.getElementById('workflow_headers');
    var body = document.getElementById('workflow_states');

    var new_state = prompt("Please enter the new state name", "New state");

    var new_header = header.cloneNode(true);
    new_header.textContent = new_state;
    new_header.id = parseInt(column.id) + 1;

    var new_column = document.createElement("td");
    new_column.id = parseInt(column.id) + 1;

    

    headers.insertBefore(new_header, header.nextElementSibling);
    body.insertBefore(new_column, column.nextElementSibling);

    update_positions(new_header);
    update_positions(new_column);

    var url = "/backend/states/insert_state.php"
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            if (xhttp.responseText < 0) { // If is negative, there was an error
                alert("Error: State not saved");
            }
            else {
                new_header.setAttribute("name", "state_" + xhttp.responseText);
                new_column.setAttribute("name", "statebody_" + xhttp.responseText);
            }
        }
        else {
            console.log({ 'status': this.status, 'state': this.readyState })
        }
    };
    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var parameters = {
        'workflow_id': window.localStorage.getItem("currentWorkflow"),
        'name': new_state,
        'position': parseInt(new_column.id)
    };

    var str_json = "json_string=" + (JSON.stringify(parameters));
    xhttp.send(str_json);
    create_state_buttons(new_header);
}

function update_position(elmnt){
    elmnt.id = parseInt(elmnt.id);
    var name = elmnt.getAttribute("name");
    db_id = name.split("_")[1];

    var url = `/backend/states/update_state_position.php?id=${db_id}&new_position=${elmnt.id}`
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.send();
}

function update_positions(elmnt) {
    while (elmnt = elmnt.nextElementSibling) {
        elmnt.id = parseInt(elmnt.id) + 1;
        update_position(elmnt);
    }
}

function create_state_buttons(elmnt) {
    var db_id = elmnt.getAttribute("name").split("_")[1];
    elmnt.innerHTML += `<br><div><div id="left_btn_${db_id}" onclick="move_left(${db_id})" class="workflow-btns"><i class="fas fa-arrow-circle-left"></i></div><div id="delete_btn_${db_id}" onclick="delete_status(${db_id})" class="workflow-btns"><i class="far fa-times-circle"></i></div><div id="create_btn_${db_id}" onclick="create_status(${db_id})" class="workflow-btns"><i class="far fa-plus-square"></i></div><div id="right_btn_${db_id}" onclick="move_right(${db_id})" class="workflow-btns"><i class="fas fa-arrow-circle-right"></i></div></div>`;
}


// STICKY NOTE FUNCTIONS
function get_sticky_notes() {
    var url = `/backend/stickynotes/get_stickynotes.php?workflow_id=${window.localStorage.getItem("currentWorkflow")}`;
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", url, false);

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var response = eval("(" + xhttp.responseText + ")");
            if (response[0] == false) {
                console.log(response[0].error);
            } else {
                add_notes_html(response);
            }
        } else {
            console.log({ 'status': this.status, 'state': this.readyState });
        }
    };
    xhttp.send();

}

function add_notes_html(notes) {
    notes.forEach((note) => {
        var state = document.getElementsByName(`statebody_${note.status_id}`)[0];
        var new_div = document.createElement('div');
        new_div.innerHTML = note.html_code;
        state.appendChild(new_div.children[0]); 
        var note_added = document.getElementById(`sticky_note_${note.id}`);
        set_note_functions(note_added, note.description);
    });
}

function set_note_functions(note,description) {
    var toolsContainer = note.children[1];
    var noteTextarea = note.children[0];
    var changeColorInput = toolsContainer.children[0];
    var moveBtn = toolsContainer.children[1];
    var removeBtn = toolsContainer.children[2];

    note.ondblclick = function () { toolsContainer.style.display = 'block'; };
    note.style.position = "fixed";

    noteTextarea.textContent = description;
    noteTextarea.addEventListener("change", () => { update_note(note); });

    changeColorInput.addEventListener("change", (e) => {
        note.style.background = e.target.value;
        noteTextarea.style.background = e.target.value;
        toolsContainer.style.display = 'none';
        update_note(note);
    }, false);
    var rgb = RGBToHex(note.style.background);
    changeColorInput.value = rgb;

    moveBtn.onmouseover = function () { dragElement(note, toolsContainer) };

    removeBtn.onclick = function () {
        note.remove();
        delete_note(note);
    };
}

function createNote() {

    // Get the value from the color input
    var color = document.getElementById("sticky_note_color").value;

    // Create the main container
    var note = document.createElement("DIV");
    note.className = "sticky_note";
    note.style.background = color;
    note.style.top = '10px';
    note.style.left = '10px';

    // Create the container for the note tool (move, change color and delete)
    var toolsContainer = document.createElement("DIV");
    toolsContainer.className = "color_button_container";
    toolsContainer.style.display = 'none';

    // Create the textarea
    var noteTextarea = document.createElement("TEXTAREA");
    noteTextarea.style.background = color;
    noteTextarea.addEventListener("change", () => { update_note(note); });

    // Create the change color input
    var changeColorInput = document.createElement("INPUT");
    changeColorInput.setAttribute("type", "color");
    changeColorInput.className = "little_sticky_note_color";
    changeColorInput.value = color;
    changeColorInput.addEventListener("change", (e) => {
        note.style.background = e.target.value;
        noteTextarea.style.background = e.target.value;
        toolsContainer.style.display = 'none';
    }, false);
    toolsContainer.appendChild(changeColorInput);

    //Create the move button
    var moveBtn = document.createElement("BUTTON");
    moveBtn.className = "move_btn";
    moveBtn.onmouseover = function () { dragElement(note, toolsContainer) };
    toolsContainer.appendChild(moveBtn);

    //Create the remove button
    var removeBtn = document.createElement("BUTTON");
    removeBtn.className = "remove_btn";
    removeBtn.onclick = function () {
        note.remove();
        delete_note(note);
    };
    toolsContainer.appendChild(removeBtn);

    note.ondblclick = function () { toolsContainer.style.display = 'block'; };
    note.appendChild(noteTextarea);
    note.appendChild(toolsContainer);

    document.body.appendChild(note);
    dragElement(note, toolsContainer);
    insert_note(note);
}

function dragElement(elmnt, toolsContainer) {
    elmnt.style.cursor = "move";
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;
    var table = document.getElementById('workflow');

    var last_selected = null;
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        elmnt.style.transform = 'rotate(' + 6 + 'deg)';
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

        for (var i = 0; i < table.rows[1].cells.length; i++) {
            var rect = table.rows[1].cells[i].getBoundingClientRect();
            if (elmnt.getBoundingClientRect().x > rect.x && elmnt.getBoundingClientRect().x < rect.x + rect.width) {
                last_selected = table.rows[1].cells[i];
                table.rows[1].cells[i].style.background = "lightgray";
                table.rows[1].cells[i].style.width = 130 + "px";
            } else {
                table.rows[1].cells[i].style.background = "white";
                table.rows[1].cells[i].style.width = 120 + "px";
            }
        }
    }

    function closeDragElement() {
        if (last_selected !== null) {
            last_selected.appendChild(elmnt);
            last_selected.style.background = "white";
        }
        toolsContainer.style.display = 'none';
        elmnt.style.cursor = "text";
        elmnt.onmousedown = null;
        elmnt.style.transform = 'rotate(' + 0 + 'deg)';
        document.onmouseup = null;
        document.onmousemove = null;
        update_note(elmnt);
    }
}

function insert_note(elmnt) {
    var url = "/backend/stickynotes/insert_stickynote.php"
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            if (xhttp.responseText < 0) { // If is negative, there was an error
                alert("Error: Sticky note not saved");
            }
            else {
                elmnt.id = "sticky_note_" + xhttp.responseText;
            }
        }
        else {
            console.log({ 'status': this.status, 'state': this.readyState })
        }
    };
    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var parameters = {
        'workflow_id': window.localStorage.getItem("currentWorkflow"),
        'status_id': elmnt.parentElement.id,
        'html_code': elmnt.outerHTML,
        'description': elmnt.firstChild.value,
    };

    var str_json = "json_string=" + (JSON.stringify(parameters));
    xhttp.send(str_json);
}

function update_note(elmnt) {
    var url = "/backend/stickynotes/update_stickynote.php"
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            if (xhttp.responseText < 0) { // If is negative, there was an error
                alert("Error: Sticky note not saved");
            }
        }
        else {
            console.log({ 'status': this.status, 'state': this.readyState })
        }
    };
    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var parameters = {
        'note_id': elmnt.id.split("_")[2],
        'status_id': elmnt.parentElement.getAttribute("name").split("_")[1],
        'html_code': elmnt.outerHTML,
        'description': elmnt.firstChild.value,
    };

    var str_json = "json_string=" + (JSON.stringify(parameters));
    xhttp.send(str_json);
}

function delete_note(elmnt) {
    var url = "/backend/stickynotes/delete_stickynote.php";

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, false);
    // xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            console.log(xhttp.responseText);
            // if (response[0] == false){
            //     console.log(response[0].error);
            // } else {
            //     window.location = "index.html";
            // }
        }
        else {
            console.log({ "status": this.status, "state": this.readyState })
        }
    };

    var parameters = new FormData();
    parameters.append("note_id", elmnt.id.split("_")[2]);

    xhttp.send(parameters);
}

function RGBToHex(rgb) {
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    rgb = rgb.substr(4).split(")")[0].split(sep);

    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;

    return "#" + r + g + b;
}