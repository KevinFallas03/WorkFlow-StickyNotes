//Make the DIV element draggagle:
function createNote(color){
    var cont = document.createElement("TEXTAREA");
    cont.id = "mydivheader";
    cont.style.background = color;
    cont.ondblclick = function() {dragElement(cont)};

    document.body.appendChild(cont);
    dragElement(cont);
}

function dragElement(elmnt) {
  elmnt.style.cursor = "move";
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;
  var table = document.getElementById('workflow');

  var last_selected;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    document.onmouseup = closeDragElement;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
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
    last_selected.appendChild(elmnt);
    last_selected.style.background = "white";
    elmnt.style.cursor = "text";
    elmnt.onmousedown = null;
    document.onmouseup = null;
    document.onmousemove = null;
  }
}