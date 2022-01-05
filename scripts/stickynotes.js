function show_menu(elmnt,toolsContainer){
  toolsContainer.style.display = 'block';
}

//Make the DIV element draggagle:
function createNote(){
  // Get the value from the color input
  var color = document.getElementById("sticky_note_color").value;
  
  // Create the main container
  var note = document.createElement("DIV");
  note.id = "mydivheader";
  note.style.background = color;

  // Create the container for the note tool (move, change color)
  var toolsContainer = document.createElement("DIV");
  toolsContainer.id = "color_button_container";
  toolsContainer.style.display = 'none';

  // Create the textarea
  var noteTextarea = document.createElement("TEXTAREA");
  noteTextarea.style.background = color;
  
  // Create the change color input
  var changeColorInput = document.createElement("INPUT");
  changeColorInput.setAttribute("type", "color");
  changeColorInput.id = "little_sticky_note_color";
  changeColorInput.value = color;
  changeColorInput.addEventListener("change",(e)=>{
    note.style.background = e.target.value;
    noteTextarea.style.background = e.target.value;
    toolsContainer.style.display = 'none';
  }, false);
  toolsContainer.appendChild(changeColorInput);

  //Create the move button
  var moveBtn = document.createElement("BUTTON");
  moveBtn.id = "move_btn";
  moveBtn.onmouseover = function() {dragElement(note, toolsContainer)};
  toolsContainer.appendChild(moveBtn);

  //Create the move button
  var removeBtn = document.createElement("BUTTON");
  removeBtn.id = "remove_btn";
  removeBtn.onclick = function() {note.remove()};
  toolsContainer.appendChild(removeBtn);

  note.ondblclick = function() {toolsContainer.style.display = 'block';};
  note.appendChild(noteTextarea);
  note.appendChild(toolsContainer);

  document.body.appendChild(note);
  dragElement(note,toolsContainer);
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
    elmnt.style.transform = 'rotate('+0+'deg)'; 
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

    for (var i = 1; i < table.rows[1].cells.length; i++) {
        var rect = table.rows[1].cells[i].getBoundingClientRect();
        if(elmnt.getBoundingClientRect().x > rect.x && elmnt.getBoundingClientRect().x < rect.x+rect.width){
            last_selected = table.rows[1].cells[i]; 
            table.rows[1].cells[i].style.background = "lightgray";
            table.rows[1].cells[i].style.width = 130+"px";
        }else{
            table.rows[1].cells[i].style.background = "white";
            table.rows[1].cells[i].style.width = 120+"px";
        }
    }
  }

  function closeDragElement() {
    if(last_selected !== null){
        last_selected.appendChild(elmnt);
        last_selected.style.background = "white";
    }
    toolsContainer.style.display = 'none';
    elmnt.style.cursor = "text";
    elmnt.onmousedown = null;
    elmnt.style.transform = 'rotate('+6+'deg)'; 
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function insert_note(elmnt){
  var url = "/backend/insert_stickynote.php"
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
    'workflow_id': 14,
    'status_id': elmnt.parentElement.id,
    'html_code': elmnt.outerHTML,
    'description': elmnt.firstChild.value,
  };

  var str_json = "json_string=" + (JSON.stringify(parameters));
  xhttp.send(str_json);
}

function upsert_note(elmnt){
  var url = "/backend/upsert_stickynote.php"
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          response=eval ("("+xhttp.responseText+")");
          
          if (response[0]==false){
              console.log(response[1].error);
          }
          else{
              alert("Sticky note added");
          }
      }
      else {
          console.log({'status': this.status, 'state': this.readyState})
      }
  };
  xhttp.open("POST", url, false);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  var parameters = new FormData();

  parameters.append('workflow_id', 14);
  parameters.append('status_id', elmnt.parentElement.id);
  parameters.append('html_code', elmnt);
  parameters.append('description', elmnt.firstChild.value);

  var str_json = "json_string=" + (JSON.stringify(parameters));
  
  request.send(str_json);
}