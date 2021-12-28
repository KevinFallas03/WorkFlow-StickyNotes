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

function get_workflows()
{
    workflows_request();
    document.getElementById("workflows_id").innerHTML="";
    console.log(data);
    data.forEach(
        element => 
        {
            console.log(element);
            workflow = document.createElement("div");
            // workflow.className = workflow_item;
            workflow.setAttribute("id", "workflow"+element.id);
            document.getElementById("workflows_id").appendChild(workflow);
            workflow_element = document.createElement("button");
            workflow.className = "workflow-item"
            workflow_element.onclick = `open_workflow(event, ${element.name})`;
            workflow_element.innerHTML= element.name;
            workflow.appendChild(workflow_element);
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