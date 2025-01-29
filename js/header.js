document.addEventListener("DOMContentLoaded", function () {
    const usuario = sessionStorage.getItem("usuario");
    const tipo = sessionStorage.getItem("tipo");
    const usuarioElemento = document.querySelector(".contenedor-menu p");
    const navBar = document.querySelector(".navbar");

    // Modificar el contenido del usuario en el header
    if (usuario && usuarioElemento) {
        usuarioElemento.textContent = usuario;
    }/* else if (usuarioElemento) {
        usuarioElemento.textContent = "";
    }*/

    // Ocultar la barra de navegación si no hay "tipo" en sessionStorage
    if (!tipo) {
        navBar.style.display = "none";
        return;
    }

    // Mostrar u ocultar elementos de la navbar según el tipo de usuario
    const enlaces = document.querySelectorAll(".navbar-brand");

    enlaces.forEach(enlace => {
        const texto = enlace.textContent.trim();
        
        if (tipo === "user" && (texto === "Gestión bares" || texto === "Añadir nueva tapa")) {
            enlace.style.display = "none"; // Oculta estos elementos para usuarios normales
        }
    });
});

document.querySelector(".boton-login").addEventListener("click", () => {
    let rutaBase = window.location.pathname.includes("/html/") ? "login.html" : "html/login.html";
    window.location.href = rutaBase;
});
