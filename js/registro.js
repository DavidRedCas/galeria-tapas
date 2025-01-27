document.getElementById("submit").addEventListener("click", function (event) {
    let formValido = true;

    if (!validarNombre()) formValido = false;
    if (!validarPrimerApellido()) formValido = false;
    if (!validarSegundoApellido()) formValido = false;
    if (!validarCorreo()) formValido = false;
    if (!validarNombreUsuario()) formValido = false;
    if (!validarContrasena()) formValido = false;
    if (!validarConfirmacionContrasena()) formValido = false;
    if (!validarPoliticaPrivacidad()) formValido = false;

    if (formValido) {
        alert("Formulario enviado con éxito.");
    }else{
        event.preventDefault();
    }
});

function validarNombre() {
    const nombre = document.getElementById("nombre");
    const errorNombre = document.getElementById("errornombre");
    const regexNombre = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/;
    const esValido = regexNombre.test(nombre.value) && nombre.value.length >= 3 && nombre.value.length <= 20;

    manejarErrores(nombre, errorNombre, esValido);
    return esValido;
}

function validarPrimerApellido() {
    const ape1 = document.getElementById("ape1");
    const errorApe1 = document.getElementById("errorape1");
    const regexApellido = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+([-\s](de(\s)?(la|los)?|del)?\s?[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?$/;
    const esValido = regexApellido.test(ape1.value) && ape1.value.length >= 3 && ape1.value.length <= 50;

    manejarErrores(ape1, errorApe1, esValido);
    return esValido;
}

function validarSegundoApellido() {
    const ape2 = document.getElementById("ape2");
    const errorApe2 = document.getElementById("errorape2");
    const regexApellido = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+([-\s](de(\s)?(la|los)?|del)?\s?[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?$/;
    const esValido = ape2.value === "" || (regexApellido.test(ape2.value) && ape2.value.length >= 3 && ape2.value.length <= 50);

    manejarErrores(ape2, errorApe2, esValido);
    return esValido;
}

function validarCorreo() {
    const correo = document.getElementById("correo");
    const errorCorreo = document.getElementById("errorcorreo");
    const regexCorreo = /^(?!@)(?!.*\.\.)(?!.*\.$)(?!.*\.$)([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    const esValido = regexCorreo.test(correo.value);

    manejarErrores(correo, errorCorreo, esValido);
    return esValido;
}

function validarNombreUsuario() {
    const user = document.getElementById("user");
    const errorUser = document.getElementById("erroruser");
    const regexUser = /^(?!_)[A-Za-z0-9_]{4,25}$/;
    const esValido = regexUser.test(user.value) && /[A-Za-z]/.test(user.value);

    manejarErrores(user, errorUser, esValido);
    return esValido;
}

function validarContrasena() {
    const contra = document.getElementById("contra");
    const errorContra = document.getElementById("errorcontra");
    const regexContra = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    const esValido = regexContra.test(contra.value);

    manejarErrores(contra, errorContra, esValido);
    return esValido;
}

function validarConfirmacionContrasena() {
    let esValido = false;
    if(validarContrasena()){
        const contra = document.getElementById("contra");
        const confContra = document.getElementById("confContra");
        const errorConfContra = document.getElementById("errorconfContra");
        esValido = confContra.value === contra.value;

        manejarErrores(confContra, errorConfContra, esValido);
    }
    return esValido;
}

function validarPoliticaPrivacidad() {
    const politica = document.getElementById("politica");
    const errorPolitica = document.getElementById("errorpolitica");
    const esValido = politica.checked;

    manejarErroresCheckbox(politica, errorPolitica, esValido);
    return esValido;
}

function manejarErrores(campo, errorElemento, esValido) {
    if (!esValido) {
        campo.classList.add("errorInput");
        errorElemento.classList.remove("escondido");
    } else {
        campo.classList.remove("errorInput");
        errorElemento.classList.add("escondido");
    }
}

function manejarErroresCheckbox(campo, errorElemento, esValido) {
    if (!esValido) {
        campo.classList.add("errorCheckbox");
        errorElemento.classList.remove("escondido");
    } else {
        campo.classList.remove("errorCheckbox");
        errorElemento.classList.add("escondido");
    }
}

document.querySelector(".boton-login").addEventListener("click", (event) => {
    window.location.href = "login.html";
});