const token = sessionStorage.getItem("token");

const urlBase = "http://localhost/www/ApiTapas/api/";

document.addEventListener('DOMContentLoaded', async () => {
    // Obtener los bares desde la API
    const baresMapa = await obtenerNombreBares();
    

    const selectBar = document.getElementById('bar');

    // Limpiar las opciones del select (manteniendo la opción predeterminada)
    while (selectBar.firstChild) {
        selectBar.removeChild(selectBar.firstChild);
    }

    // Crear la opción por defecto y ponerla como disabled
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona un bar';
    defaultOption.disabled = true; // Ponerla como no seleccionable
    defaultOption.selected = true; // Asegurar que esta opción sea la seleccionada por defecto
    selectBar.appendChild(defaultOption);

    // Añadir las opciones de bares al select utilizando DOM
    Object.keys(baresMapa).forEach(barId => {
        const option = document.createElement('option');
        option.value = barId; // El ID del bar
        option.textContent = baresMapa[barId]; // El nombre del bar
        selectBar.appendChild(option);
    });
});

document.getElementById("form-tapa").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Obtener los valores del formulario
    const formData = new FormData();
    formData.append("titulo", document.getElementById("titulo").value);
    formData.append("descripcion", document.getElementById("descripcion").value);
    formData.append("alt", document.getElementById("alt").value);
    formData.append("bar", document.getElementById("bar").value);
    formData.append("imagen", document.getElementById("imagen").value);
            
    try {
        // Realizar la solicitud POST para guardar la tapa
        const response = await fetch(urlBase+'tapas/', { // Reemplaza con la URL de tu API
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token, // Aquí pones el token JWT si es necesario
            },
            body: formData,
        });

        // Comprobar si la respuesta fue exitosa
        if (response.ok) {
            const data = await response.json();
            if (data.id_tapa) {
                alert("Tapa guardada con éxito!");
                window.location.href = "../index.html"; // Redirigir al índice
            } else {
                alert("Error al guardar la tapa.");
            }
        } else {
            alert(`Error: "Hubo un problema al guardar la tapa."`);
        }
    } catch (error) {
        // Manejo de errores
        console.error("Hubo un error con la solicitud:", error);
        alert("Error al intentar guardar la tapa. Intenta nuevamente.");
    }
});

document.getElementById("cancelar").addEventListener("click", () => {
    window.location.href = "../index.html"; // Redirige si el usuario cancela
});


async function obtenerNombreBares() {
    try {
        const response = await fetch(urlBase+'bares/');
        const bares = await response.json();
        const baresMapa = {};
        bares.forEach(bar => {
            baresMapa[parseInt(bar.id_bar)] = bar.nombre;
        });
        return baresMapa;
    } catch (error) {
        console.error("Error al obtener los bares:", error);
        return {};
    }
}