var data = [{}]

window.onload = () => {
    get_workflows();
}

function workflows_request() {
    var url = "/backend/workflows/get_workflows.php"
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            response = eval("(" + xhttp.responseText + ")");
            console.log(response);
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
    data = [{}];
    workflows_request();
    data.forEach(
        element => {
            create_workflow_on_httml(element);
        }
    )
}

function create_workflow_on_httml(element) {
    workflow = document.createElement("div");
    workflow.className = "workflow-item";
    workflow.setAttribute("id", element.id);
    workflow.setAttribute("name", "workflow" + element.id);

    delete_button = document.createElement("div");
    delete_button.setAttribute("id", "delete_button" + element.id);
    delete_button.className = "crud-btn";
    delete_icon = document.createElement("i");
    delete_icon.className = "fa fa-trash";
    delete_button.appendChild(delete_icon);

    edit_button = document.createElement("div");
    edit_button.setAttribute("id", "edit_button" + element.id);
    edit_button.className = "crud-btn";
    edit_icon = document.createElement("i");
    edit_icon.className = "fas fa-pencil-alt";
    edit_button.appendChild(edit_icon);

    info_button = document.createElement("div");
    info_button.setAttribute("id", "info_button" + element.id);
    info_button.className = "crud-btn";
    info_icon = document.createElement("i");
    info_icon.className = "fa fa-info-circle";
    info_button.appendChild(info_icon);

    workflow_clickable = document.createElement("div");
    workflow_clickable.setAttribute("id", "wf_clickable" + element.id);
    workflow_clickable.className = "wf-clickable";
    workflow_clickable.innerHTML = element.name;

    delete_button.onclick = () => {
        // alert("Deleting workflow " + element.name + " id:" + element.id);
        workflow_to_delete = document.getElementsByName("workflow" + element.id);
        // console.log(element.id);
        delete_workflow(workflow_to_delete[0]); // always in 0 because the element returned is unique
    };

    edit_button.onclick = () => {
        alert("Editing workflow");
        element.name = prompt("Name ", element.name);
        element.description = prompt("Description", element.description);
        edit_workflow_data(element.id, element.name, element.description);
        // console.log(new_name);
        // console.log(new_description);
    };

    info_button.onclick = () => {
        alert("Workflow " + element.id + ": " + element.name
            + "\nDescription: " + element.description
            + "\nCreation date: " + element.creation_date);
    };

    workflow_clickable.onclick = () => {
        alert("Switching to workflow " + element.name);
        window.localStorage.setItem("currentWorkflow", element.id);
        get_workflow();
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
            // response = eval ("("+xhttp.responseText+")");
            console.log(response);
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

function add_states() {

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

    xhttp.onreadystatechange = function(){
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            console.log(xhttp.responseText);
            response = eval( "(" + xhttp.responseText + ")" );
            
            if (response[0]==false) {
                console.log(response[0].error);
            } else {
                alert("Workflow added");
                window.location = "index.html"
            }
        } else {
            console.log({'status': this.status, 'state': this.readyState});
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
            // response = eval ("("+xhttp.responseText+")");
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

function move_right(id) {
    var header = document.getElementsByName("state_" + id)[0];
    var column = document.getElementsByName("statebody_" + id)[0];
    console.log(column);

    var headers = document.getElementById('workflow_headers');
    var body = document.getElementById('workflow_states');

    for (let i = 0; i < column.children.length; i++) {
        var left = parseInt(column.children[i].style.left.slice(0, -2));
        column.children[i].style.left = (left + 120) + 'px';
    }

    for (let i = 0; i < column.nextElementSibling.children.length; i++) {
        var left = parseInt(column.nextElementSibling.children[i].style.left.slice(0, -2));
        column.nextElementSibling.children[i].style.left = (left - 120) + 'px';
    }

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

    for (let i = 0; i < column.children.length; i++) {
        var left = parseInt(column.children[i].style.left.slice(0, -2));
        column.children[i].style.left = (left - 120) + 'px';
    }

    for (let i = 0; i < column.nextElementSibling.children.length; i++) {
        var left = parseInt(column.nextElementSibling.children[i].style.left.slice(0, -2));
        column.nextElementSibling.children[i].style.left = (left + 120) + 'px';
    }
}

function delete_status(id) {
    var parent = document.getElementById("workflow_states");
    var ch = [...parent.children];
    var header2 = ch.find((child)=>{
        return parseInt(child.id,10) === parseInt(id,10);
    })
    header2.remove();

    var parent = document.getElementById("workflow_headers");
    var ch = [...parent.children];
    var header2 = ch.find((child)=>{
        return parseInt(child.id,10) === parseInt(id,10);
    })
    header2.remove();
}

function create_status(id) {
    var header = document.getElementsByName("state_" + id)[0];
    var column = document.getElementsByName("statebody_" + id)[0];

    var headers = document.getElementById('workflow_headers');
    var body = document.getElementById('workflow_states');

    var new_state = prompt("Please enter the new state name", "New state");

    var new_header = header.cloneNode(true);
    new_header.textContent = new_state;
    new_header.id = parseInt(id)+1;
    
    var new_column = document.createElement("td");
    new_column.id = parseInt(id)+1;
    
    create_state_buttons(new_header);

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
                new_header.setAttribute("name", "state_"+xhttp.responseText);
                new_column.setAttribute("name", "statebody_"+xhttp.responseText);
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
        'position': parseInt(id)+1
    };
    
    var str_json = "json_string=" + (JSON.stringify(parameters));
    xhttp.send(str_json);
}

function update_positions(elmnt){
    // var url = "/backend/states/update_state_position.php"
    // var xhttp = new XMLHttpRequest();
    while (elmnt = elmnt.nextElementSibling) {

        // xhttp.open("POST", url, false);
        // xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        var params = new FormData();

        elmnt.id = parseInt(elmnt.id)+1;
        var name = elmnt.getAttribute("name");
        db_id = name.split("_")[1];
        params.append("id", db_id);
        params.append("new_position", parseInt(elmnt.id));

        // xhttp.send(params);
    }
}

function create_state_buttons(elmnt){
    var bd_id = elmnt.getAttribute("name").split("_")[1];
    elmnt.innerHTML += `<br><div><div id="left_btn_${elmnt.id}" onclick="move_left(${elmnt.id})" class="workflow-btns"><i class="fas fa-arrow-circle-left"></i></div><div id="delete_btn_${elmnt.id}" onclick="delete_status(${elmnt.id})" class="workflow-btns"><i class="far fa-times-circle"></i></div><div id="create_btn_${elmnt.id}" onclick="create_status(${elmnt.id})" class="workflow-btns"><i class="far fa-plus-square"></i></div><div id="right_btn_${elmnt.id}" onclick="move_right(${elmnt.id})" class="workflow-btns"><i class="fas fa-arrow-circle-right"></i></div></div>`;
}

function get_workflow(){
    var workflow_id = window.localStorage.getItem("currentWorkflow");
    var url = "/backend/workflows/get_workflow.php?workflow_id="+workflow_id;
    var xhttp = new XMLHttpRequest();
    var params = new FormData();
    params.append("workflow_id", 19);

    xhttp.open("GET", url, false);    
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            //console.log(xhttp.responseText);
            response = eval("(" + xhttp.responseText + ")");
            if (response[0] == false) {
                console.log(response[0].error);
            }
            else {
                // states = response;
                build_workflow(response);
            }
        }
        else {
            console.log({ "status": this.status, "state": this.readyState })
        }
    };
    
    xhttp.send();
}

function build_workflow(states){
    var headers = document.getElementById("workflow_headers");
    var columns = document.getElementById("workflow_states");
    headers.innerHTML = "";
    columns.innerHTML = "";
    states.forEach((state)=>{
        
    })
    console.log(states);

}