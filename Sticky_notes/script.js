function show_menu(elmnt,buttonCont){
    buttonCont.style.display = 'block';
    // dragElement(elmnt, buttonCont);
}

function change_color(elmnt1,elmnt2,color){
    elmnt1.style.background = color;
    elmnt2.style.background = color;
}

//Make the DIV element draggagle:
function createNote(color){
    // Create the container og buttons of the note
    var buttonCont = document.createElement("DIV");
    var cont = document.createElement("DIV");
    var ta = document.createElement("TEXTAREA");

    buttonCont.id = "color_button_container";
    buttonCont.style.display = 'none';

    const colors = ["#ace9dd", "#fbeba5", "#b5efce", "#fdddaa"];
    colors.forEach((color)=>{
        var colorBtn = document.createElement("BUTTON");
        colorBtn.style.background = color;
        colorBtn.id = "little_color_btn";
        colorBtn.onclick = function() {change_color(cont,ta, color)};
        buttonCont.appendChild(colorBtn);
    });

    var moveBtn = document.createElement("BUTTON");
    moveBtn.id = "move_btn";
    moveBtn.onclick = function() {dragElement(cont, buttonCont)};
    buttonCont.appendChild(moveBtn);

    var cont = document.createElement("DIV");
    cont.id = "mydivheader";
    cont.style.background = color;
    cont.ondblclick = function() {show_menu(cont, buttonCont)};

    var ta = document.createElement("TEXTAREA");
    ta.style.background = color;

    cont.appendChild(ta);
    cont.appendChild(buttonCont);

    document.body.appendChild(cont);
    dragElement(cont,buttonCont);
}

function dragElement(elmnt, buttonCont) {
  elmnt.style.cursor = "move";
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;
  var table = document.getElementById('workflow');

  var last_selected = null;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    
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
    buttonCont.style.display = 'none';
    elmnt.style.cursor = "text";
    elmnt.onmousedown = null;
    document.onmouseup = null;
    document.onmousemove = null;
  }
}