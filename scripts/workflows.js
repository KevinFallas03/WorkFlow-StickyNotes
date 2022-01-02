var data = [{}]
var url = "http://inclusive-whiteboard.com/backend/get_workflows.php?user_id=1"

function workflows_request()
{
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) 
        {
            response=eval ("("+xhttp.responseText+")");
            if (response[0]==false)
            {
                console.log(response[1].error);
            }
            else
            {
                data = response;
            }
        }
        else {
            console.log({'status': this.status, 'state': this.readyState})
        }
    };
    
    xhttp.open("GET", url, false);
    xhttp.send();  
}

window.onload = () =>{
    get_workflows();
}

function get_workflows()
{
    workflows_request();
    data.forEach(
        element => 
        {
            // console.log(element);
            workflow = document.createElement("div");
            workflow.className = "workflow-item";
            workflow.setAttribute("id", "workflow" + element.id);

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
                alert("Deleting workflow " + element.name);
            };

            edit_button.onclick = () => {
                alert("Editing workflow " + element.name);
            };

            info_button.onclick = () => {
                alert("Workflow name: "+ element.name +"\nDescription: " + element.description + "\nCreation date: " + element.creation_date);
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
        
    )
}

function open_workflow(event, workflow_name) {
    // Declare all variables
    var i, board_content, workflows;
  
    // Get all elements with class="tabcontent" and hide them
    board_content = document.getElementsByClassName("board");
    for (i = 0; i < board_content.length; i++) {
        board_content[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    workflows = document.getElementsByClassName("workflows");
    for (i = 0; i < workflows.length; i++) {
        workflows[i].className = workflows[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(workflow_name).style.display = "block";
    event.currentTarget.className += " active";
  }