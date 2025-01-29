document.addEventListener("DOMContentLoaded", function () {
    const usuario = sessionStorage.getItem("usuario");
    const tipo = sessionStorage.getItem("tipo");

    const contenedorMenu = document.querySelector(".contenedor-menu");

    const usuarioElemento = document.createElement("p");
    usuarioElemento.classList.add("name_user");
    usuarioElemento.textContent = usuario ? usuario : "";
    contenedorMenu.appendChild(usuarioElemento);

    const botonesMenu = document.createElement("div");
    botonesMenu.classList.add("botones-menu");

    if (usuario) {
        const botonCerrar = document.createElement("button");
        botonCerrar.classList.add("boton-cerrar");
        botonCerrar.textContent = "Cerrar Sesión";
        botonCerrar.addEventListener("click", () => {
            sessionStorage.removeItem("tipo");
            sessionStorage.removeItem("usuario");
            sessionStorage.removeItem("token");
            location.reload();
        });
        botonesMenu.appendChild(botonCerrar);
    } else {
        const botonLogin = document.createElement("button");
        botonLogin.classList.add("boton-login");
        botonLogin.addEventListener("click", () => {
            let rutaBase = window.location.pathname.includes("/html/") ? "login.html" : "html/login.html";
            window.location.href = rutaBase;
        });
        botonLogin.textContent = "Login";

        const botonRegistro = document.createElement("button");
        botonRegistro.classList.add("boton-registro");
        botonRegistro.addEventListener("click", () => {
            let rutaBase = window.location.pathname.includes("/html/") ? "registro.html" : "html/registro.html";
            window.location.href = rutaBase;
        });
        botonRegistro.textContent = "Registrarse";

        botonesMenu.appendChild(botonLogin);
        botonesMenu.appendChild(botonRegistro);
    }

    contenedorMenu.appendChild(botonesMenu);

    const navbar = document.createElement("nav");
    navbar.classList.add("navbar", "navbar-expand-lg", "navbar-light");

    const enlaces = [
        { texto: "Galería", href: "#galeria", requiereLogin: true },
        { texto: "Perfil", href: "#", requiereLogin: true },
        { texto: "Añadir nueva tapa", href: "html/nueva-tapa.html", adminOnly: true },
        { texto: "Gestión bares", href: "#", adminOnly: true },
    ];

    enlaces.forEach(enlaceData => {
        if (enlaceData.adminOnly && tipo !== "admin") return;
        if (enlaceData.requiereLogin && !usuario) return;

        const enlace = document.createElement("a");
        enlace.classList.add("navbar-brand", "px-3");
        enlace.href = enlaceData.href;
        enlace.textContent = enlaceData.texto;
        navbar.appendChild(enlace);
    });

    if(tipo){
        const header = document.querySelector("header");
        header.after(navbar);
    }
});
