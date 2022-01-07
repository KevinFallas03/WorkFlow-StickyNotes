// function login()
// {
//     username = document.getElementById('username_id').value;
//     password = document.getElementById('password_id').value;
    
//     console.log(username);

//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = () => {
//         if (this.readyState == 4 && this.status == 200) 
//         {
//             respuesta=eval ("("+xhttp.responseText+")");
//             console.log(respuesta);
//             if (respuesta[0]==false)
//             {
//                 notificar(respuesta[1].error);
//             }
//             else
//             {
//                 window.location.href = 'index.html';
//             }
//         }
//     };

//     xhttp.open("POST", "register.php", false);

//     var formData = new FormData();

//     formData.append("username", username);
//     formData.append("password", password);

//     xhttp.send(formData); 
// }