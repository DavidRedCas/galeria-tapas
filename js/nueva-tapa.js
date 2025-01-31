const token = sessionStorage.getItem("token");

const urlBase = "http://localhost/www/ApiTapas/api/";
const errores = document.querySelector("#erroresLogin");

document.addEventListener('DOMContentLoaded', async () => {
    const baresMapa = await obtenerNombreBares();
    

    const selectBar = document.getElementById('bar');

    while (selectBar.firstChild) {
        selectBar.removeChild(selectBar.firstChild);
    }

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecciona un bar';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectBar.appendChild(defaultOption);

    Object.keys(baresMapa).forEach(barId => {
        const option = document.createElement('option');
        option.value = barId;
        option.textContent = baresMapa[barId];
        selectBar.appendChild(option);
    });
});

document.querySelector("#form-tapa").addEventListener("submit", async (event) => {
    event.preventDefault();

    let valido = true;
    if(document.querySelector("#titulo").value === ""){
        valido = false;
        errores.textContent = "Falta el nombre de la tapa";
    } else if (document.querySelector("#descripcion").value === ""){
        valido = false;
        errores.textContent = "Falta la descripción de la tapa";
    } else if (document.querySelector("#alt").value === ""){
        valido = false;
        errores.textContent = "Falta el texto alternativo de la tapa";
    } else if (document.querySelector("#bar").value === ""){
        valido = false;
        errores.textContent = "Falta el bar al que pertenece la tapa";
    }

    if(valido){
        const formData = new FormData();
        formData.append("titulo", document.querySelector("#titulo").value);
        formData.append("descripcion", document.querySelector("#descripcion").value);
        formData.append("alt", document.querySelector("#alt").value);
        formData.append("bar", document.querySelector("#bar").value);
        formData.append("imagen", document.querySelector("#imagen").value);
                
        try {
            const response = await fetch(urlBase+'tapas/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                if (data.id_tapa) {
                    window.location.href = "../index.html";
                } else {
                    errores.textContent = "Error al guardar la tapa.";
                }
            } else {
                errores.textContent = "Hubo un problema al guardar la tapa.";
            }
        } catch (error) {
            errores.textContent = "Error al intentar guardar la tapa. Intenta nuevamente.";
        }
    }
});

document.querySelector("#cancelar").addEventListener("click", () => {
    window.location.href = "../index.html";
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