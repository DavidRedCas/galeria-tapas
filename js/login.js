
const form = document.querySelector("form");

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const errores = document.querySelector("#erroresLogin");

    const usuario = document.querySelector("#user").value;
    const contrasena = document.querySelector("#contra").value;

    if(usuario === ""){
        errores.textContent = "Rellene el usuario";
    } else if(contrasena === ""){
        errores.textContent = "Rellene la contraseña";
    }else{
        const formData = new FormData();
        formData.append("usuario", usuario);
        formData.append("contrasena", contrasena);
    
        try {
            const response = await fetch("http://localhost/www/galeria-tapas/api/clientes/", {
                method: "POST",
                body: formData
            });
    
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("usuario", data.usuario);
                sessionStorage.setItem("tipo", data.tipo);
                window.location.href = "../index.html";
            } else if (response.status === 401) {
                errores.textContent = "Contraseña incorrecta";
            } else if (response.status === 404) {
                errores.textContent = "Usuario no encontrado";
            } else {
                errores.textContent = "Error en el servidor";
            }
        } catch (error) {
            errores.textContent = "No se pudo conectar con el servidor";
        }
    }

});