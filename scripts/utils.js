function navbar_button() {
    var navbar = document.getElementById("navbar_id");
    if (navbar.className === "navbar") {
        navbar.className += " responsive";
    } else {
        navbar.className = "navbar";
    }
}