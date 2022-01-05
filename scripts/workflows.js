var data = [{}]

window.onload = () =>{
    get_workflows();
}

function workflows_request()
{
    var url = "/backend/get_workflows.php"
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
    edit_icon.className = "fa fa-pencil"; 
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
    }
    
    workflow.appendChild(workflow_clickable);
    workflow.appendChild(delete_button);
    workflow.appendChild(edit_button);
    workflow.appendChild(info_button);

    document.getElementById("workflow-list-id").appendChild(workflow);
}

function edit_workflow_data(workflow_id, name, description){
    var url = "/backend/edit_workflow_data.php";
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

}

function post_workflow(name, description){
    var url = "/backend/create_workflow.php"
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            console.log(xhttp.responseText);
            // response=eval ("("+xhttp.responseText+")");
            
            // if (response[0]==false){
            //     console.log(response[1].error);
            // }
            // else{
            //     alert("Sticky note added");
            // }
        }
        else {
            console.log({'status': this.status, 'state': this.readyState})
        }
    };
    xhttp.open("POST", url, false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var parameters = {
        'name': name,
        'description': description,
        'states': ["Unstared", "Started", "Finished"],
    };

    var str_json = "json_string=" + (JSON.stringify(parameters));
    xhttp.send(str_json);
} 

function delete_workflow(workflow){
    var url = "/backend/delete_workflow.php";
    
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