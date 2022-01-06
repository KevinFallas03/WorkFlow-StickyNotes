var data = [{}]

window.onload = () =>{
    get_workflows();
}

function workflows_request()
{
    var url = "/backend/workflows/get_workflows.php"
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) 
        {
            response = eval ("("+xhttp.responseText+")");
            console.log(response);
            if (response[0]==false)
            {
                console.log(response[0].error);
            }
            else
            {
                data = response;
            }
        }
        else {
            console.log({"status": this.status, "state": this.readyState})
        }
    };
    xhttp.open("GET", url, false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();  
}

function get_workflows()
{
    data = [{}];
    workflows_request();
    data.forEach(
        element => 
        {
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
        workflow_to_delete = document.getElementsByName("workflow"+element.id);
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
        alert("Workflow "+ element.id +": " + element.name 
            +"\nDescription: " + element.description 
            + "\nCreation date: " + element.creation_date);
    };

    workflow_clickable.onclick = () => {
        alert("Switching to workflow " + element.name);
        window.localStorage.setItem("currentWorkflow", element.id);
    }
    
    workflow.appendChild(workflow_clickable);
    workflow.appendChild(delete_button);
    workflow.appendChild(edit_button);
    workflow.appendChild(info_button);

    document.getElementById("workflow-list-id").appendChild(workflow);
}

function edit_workflow_data(workflow_id, name, description){
    var url = "/backend/workflows/edit_workflow_data.php";
    var params = new FormData();
    params.append("workflow_id", workflow_id);
    params.append("name", name);
    params.append("description", description);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, false);
    // xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhttp.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) 
        {
            // response = eval ("("+xhttp.responseText+")");
            console.log(response);
            if (response[0] == false){
                console.log(response[0].error);
            } else {
                window.location = "index.html";
            }
        }
        else {
            console.log({"status": this.status, "state": this.readyState})
        }
    };

    xhttp.send(params);  
}

function add_states(){

}

function new_workflow(){
    var name = prompt("Enter workflow's name: ");
    var description = prompt("Enter workflow's description: ");
    
    post_workflow(name, description);

}

function post_workflow(name, description){
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

function delete_workflow(workflow){
    var url = "/backend/workflows/delete_workflow.php";
    
    var params = new FormData();
    params.append("workflow_id", workflow.id);
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", url);
    // xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(params);

    xhttp.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {            
            // response = eval ("("+xhttp.responseText+")");
            if (response[0] == false) {
                console.log(response[0].error);
            } else {
                window.location = "index.html";
            }
        } else {
            console.log({"status": this.status, "state": this.readyState})
        }
    };
}

function move_right(id){
    var header = document.getElementById("th"+id);
    var column = document.getElementById("td"+id);

    var headers = document.getElementById('workflow_headers');
    var body = document.getElementById('workflow_states');

    for (let i = 0; i < column.children.length; i++) {
        var left = parseInt(column.children[i].style.left.slice(0,-2));
        column.children[i].style.left = (left+120)+'px';
    }

    for (let i = 0; i < column.nextElementSibling.children.length; i++) {
        var left = parseInt(column.nextElementSibling.children[i].style.left.slice(0,-2));
        column.nextElementSibling.children[i].style.left = (left-120)+'px';
    }

    headers.insertBefore(header,header.nextElementSibling.nextElementSibling);
    body.insertBefore(column,column.nextElementSibling.nextElementSibling);
}

function move_left(id){
    var header = document.getElementById("th"+id);
    var column = document.getElementById("td"+id);

    var headers = document.getElementById('workflow_headers');
    var body = document.getElementById('workflow_states');

    headers.insertBefore(header,header.previousElementSibling);
    body.insertBefore(column,column.previousElementSibling);

    for (let i = 0; i < column.children.length; i++) {
        var left = parseInt(column.children[i].style.left.slice(0,-2));
        column.children[i].style.left = (left-120)+'px';
    }

    for (let i = 0; i < column.nextElementSibling.children.length; i++) {
        var left = parseInt(column.nextElementSibling.children[i].style.left.slice(0,-2));
        column.nextElementSibling.children[i].style.left = (left+120)+'px';
    }
}

function delete_status(id){
    var header = document.getElementById("th"+id);
    var column = document.getElementById("td"+id);
    header.remove();
    column.remove();
}

function create_status(id){
    var header = document.getElementById("th"+id);
    var column = document.getElementById("td"+id);

    var headers = document.getElementById('workflow_headers');
    var body = document.getElementById('workflow_states');

    var new_state = prompt("Please enter your name", "New state");

    var new_header = header.cloneNode(true);
    var new_column = document.createElement("td");
    new_header.textContent = new_state;
    headers.insertBefore(new_header,header.nextElementSibling);
    body.insertBefore(new_column,column.nextElementSibling);
}