function show_menu(elmnt,toolsContainer){
  toolsContainer.style.display = 'block';
}

//Make the DIV element draggagle:
function createNote(){
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
  noteTextarea.addEventListener("change",()=>{update_note(note);});
  
  // Create the change color input
  var changeColorInput = document.createElement("INPUT");
  changeColorInput.setAttribute("type", "color");
  changeColorInput.className = "little_sticky_note_color";
  changeColorInput.value = color;
  changeColorInput.addEventListener("change",(e)=>{
    note.style.background = e.target.value;
    noteTextarea.style.background = e.target.value;
    toolsContainer.style.display = 'none';
  }, false);
  toolsContainer.appendChild(changeColorInput);

  //Create the move button
  var moveBtn = document.createElement("BUTTON");
  moveBtn.className = "move_btn";
  moveBtn.onmouseover = function() {dragElement(note, toolsContainer)};
  toolsContainer.appendChild(moveBtn);

  //Create the remove button
  var removeBtn = document.createElement("BUTTON");
  removeBtn.className = "remove_btn";
  removeBtn.onclick = function() {
    note.remove();
    delete_note(note);
  };
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
    elmnt.style.transform = 'rotate('+6+'deg)'; 
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
    elmnt.style.transform = 'rotate('+0+'deg)'; 
    document.onmouseup = null;
    document.onmousemove = null;
    update_note(elmnt);
  }
}

function insert_note(elmnt){
  var url = "/backend/stickynotes/insert_stickynote.php"
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function(){
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          if (xhttp.responseText < 0){ // If is negative, there was an error
             alert("Error: Sticky note not saved");
          }
          else{
            elmnt.id = "sticky_note_"+xhttp.responseText;
          }
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

function update_note(elmnt){
  var url = "/backend/stickynotes/update_stickynote.php"
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function(){
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          if (xhttp.responseText < 0){ // If is negative, there was an error
             alert("Error: Sticky note not saved");
          }
      }
      else {
          console.log({'status': this.status, 'state': this.readyState})
      }
  };
  xhttp.open("POST", url, false);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  var parameters = {
    'note_id': elmnt.id.split("_")[2],
    'status_id': elmnt.parentElement.id,
    'html_code': elmnt.outerHTML,
    'description': elmnt.firstChild.value,
  };

  var str_json = "json_string=" + (JSON.stringify(parameters));
  xhttp.send(str_json);
}

function delete_note(elmnt){
  var url = "/backend/stickynotes/delete_stickynote.php";

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", url, false);
  // xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhttp.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
          console.log(xhttp.responseText);
          // if (response[0] == false){
          //     console.log(response[0].error);
          // } else {
          //     window.location = "index.html";
          // }
      }
      else {
          console.log({"status": this.status, "state": this.readyState})
      }
  };

  var parameters = new FormData();
  parameters.append("note_id", elmnt.id.split("_")[2]);

  xhttp.send(parameters);
}