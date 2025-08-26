let datos = [];
function guardar(){
    if (document.getElementById("nombre").value == ""){
        alert("Por favor ingrese el nombre");
    }else if (document.getElementById("apellidos").value == ""){
        alert("Por favor ingrese el apellidos");
    }else if (document.getElementById("documento").value == ""){
        alert("Por favor ingrese el documento");
    }else if (document.getElementById("correo").value == ""){
        alert("Por favor ingrese el correo");
    }else{
        let reg = {
            nombre: document.getElementById("nombre").value,
            apellidos: document.getElementById("apellidos").value,
            documento: document.getElementById("documento").value,
            correo: document.getElementById("correo").value
        }
        datos.push(reg)
        console.log(reg);
    }
}