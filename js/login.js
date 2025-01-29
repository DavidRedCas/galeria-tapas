
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

        const usuario = document.getElementById("user").value;
        const contrasena = document.getElementById("contra").value;

        const formData = new FormData();
        formData.append("usuario", usuario);
        formData.append("contrasena", contrasena);

        try {
            const response = await fetch("http://localhost/www/ApiTapas/api/clientes/", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("usuario", data.usuario);
                sessionStorage.setItem("tipo", data.tipo);
                window.location.href = "../index.html"; // Redirige a la página de inicio
            } else if (response.status === 401) {
                alert("Credenciales incorrectas");
            } else if (response.status === 404) {
                alert("Usuario no encontrado");
            } else {
                alert("Error en el servidor");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("No se pudo conectar con el servidor");
        }
    });