function sumar() {
    let res = document.getElementById("resultado");
    let num1 = document.getElementById("num1");
    let num2 = document.getElementById("num2");
    res.textContent = parseInt(num1.value) + parseInt(num2.value);
}

function restar() {
    let res = document.getElementById("resultado");
    let num1 = document.getElementById("num1");
    let num2 = document.getElementById("num2");
    res.textContent = parseInt(num1.value) - parseInt(num2.value);
}

function multiplicar() {
    let res = document.getElementById("resultado");
    let num1 = document.getElementById("num1");
    let num2 = document.getElementById("num2");
    res.textContent = parseInt(num1.value) * parseInt(num2.value);
}

function dividir() {
    let res = document.getElementById("resultado");
    let num1 = document.getElementById("num1");
    let num2 = document.getElementById("num2");

    if(num1.value == 0 || num2.value ==0){
        alert("No se puede dividir por 0");
    }else{
        res.textContent = parseInt(num1.value) / parseInt(num2.value);
    }
}

function limpiar(){
    let res = document.getElementById("resultado");
    let num1 = document.getElementById("num1");
    let num2 = document.getElementById("num2");
    res.textContent = "0";
    num1.value = "";
    num2.value = "";
}

