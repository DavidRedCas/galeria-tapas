let tapasArray = [];
let bares = {};
const urlBase = "http://localhost/www/ApiTapas/api/";

let paginaActual = 1;
const elementosPorPagina = 6;

const tipo = sessionStorage.getItem("tipo");
const token = sessionStorage.getItem("token");

document.getElementById("mostrar-todos").addEventListener("click", (event) => {
    event.preventDefault();
    renderizarGaleriaConPaginacion(tapasArray);
});

document.getElementById("mostrar-favoritos").addEventListener("click", (event) => {
    event.preventDefault();
    const favoritos = tapasArray.filter(elemento => elemento.favorito);
    renderizarGaleriaConPaginacion(favoritos);
});

document.querySelector(".grid-galeria").addEventListener("click", (event) => {
    const clickedElement = event.target;

    if (tipo !== null && (clickedElement.classList.contains("no-favorito") || clickedElement.classList.contains("favorito"))) {
        cambiarFavorito(clickedElement);
    }
    if(tipo==="admin"){
        if(clickedElement.classList.contains("editar")){
            editarTapa(clickedElement);
        }else if(clickedElement.classList.contains("eliminar")){
            eliminarTapa(clickedElement);
        }else if(clickedElement.classList.contains("guardar")){
            guardarCambiosTapa(clickedElement);
        }else if(clickedElement.classList.contains("cancelar")){
            cancelarCambiosTapa(clickedElement);
        }
    }
});

function agregarTapa(nuevaTapa) {
    const ultimoElemento = tapasArray[tapasArray.length - 1];
    const nuevoId = ultimoElemento ? ultimoElemento.id + 1 : 0;

    nuevaTapa.id = nuevoId;

    tapasArray.push(nuevaTapa);
}

document.addEventListener("DOMContentLoaded", () => {
    obtenerNombreBares().then(baresMapa => {
        bares = baresMapa;
        obtenerTapas(bares).then(tapas => {
            tapasArray = tapas;
            renderizarGaleriaConPaginacion(tapasArray);
        });
    });
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

async function obtenerFavoritos(tapaId) {
    try {
        const response = await fetch(urlBase+`favoritos/?tapa=${tapaId}`);
        const data = await response.json();
        return data.total_favoritos || 0;
    } catch (error) {
        console.error(`Error al obtener favoritos para tapa ${tapaId}:`, error);
        return 0;
    }
}

async function obtenerTapas(baresMapa) {
    return fetch(urlBase+'tapas/')
        .then(response => response.json())
        .then(tapasData => {
            const tapasConFavoritos = tapasData.map(async tapa => {
                const nombreBar = baresMapa[parseInt(tapa.bar)] || 'Bar desconocido';
                const numFavoritos = await obtenerFavoritos(tapa.id_tapa);
                return {
                    id: parseInt(tapa.id_tapa),
                    titulo: tapa.titulo,
                    alt: tapa.alt,
                    imagen: tapa.imagen,
                    descripcion: tapa.descripcion,
                    bar: nombreBar,
                    favorito: false,
                    numFavoritos: numFavoritos
                };
            });

            return Promise.all(tapasConFavoritos);
        })
        .catch(error => {
            console.error("Error al obtener las tapas:", error);
            return [];
        });
}


function renderizarGaleriaConPaginacion(elementos) {
    const inicio = (paginaActual-1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const elementosPagina = elementos.slice(inicio, fin);

    renderizarGaleria(elementosPagina);
    renderizarControlesPaginacion(elementos);
}

function renderizarGaleria(elementos) {
    const gridGaleria = document.querySelector(".grid-galeria");
    while (gridGaleria.firstChild) {
        gridGaleria.removeChild(gridGaleria.firstChild);
    }

    elementos.forEach((elemento) => {
        const elementoGrid = crearElementoGrid(elemento);
        gridGaleria.appendChild(elementoGrid);
    });
}

function crearElementoGrid(elemento) {
    const elementoGrid = document.createElement("div");
    elementoGrid.className = "elemento-grid";

    const picture = document.createElement("picture");

    let imagen = elemento.imagen || "default.jpg";

    const sourceSmall = document.createElement("source");
    sourceSmall.srcset = "img/480/"+imagen;
    sourceSmall.media = "(max-width: 600px)";
    picture.appendChild(sourceSmall);

    const sourceMedium = document.createElement("source");
    sourceMedium.srcset = "img/768/"+imagen;
    sourceMedium.media = "(max-width: 1024px)";
    picture.appendChild(sourceMedium);

    const sourceLarge = document.createElement("source");
    sourceLarge.srcset = "img/1080/"+imagen;
    sourceLarge.media = "(min-width: 1025px)";
    picture.appendChild(sourceLarge);

    const img = document.createElement("img");
    img.src = "img/1080/"+imagen;
    img.alt = elemento.alt;
    picture.appendChild(img);

    const noFavoritoImg = document.createElement("img");
    noFavoritoImg.className = "boton-galeria no-favorito";
    noFavoritoImg.src = "img/vect/star.svg";
    noFavoritoImg.alt = "Marcar como favorito";

    const numFavoritos = document.createElement("p");
    numFavoritos.textContent = elemento.numFavoritos;
    numFavoritos.className = "numFavoritos";

    const botonesGaleria = document.createElement("div");
    botonesGaleria.className = "botones-galeria";
    if(tipo !== null){
        const favoritoImg = document.createElement("img");
        favoritoImg.className = "boton-galeria favorito";
        favoritoImg.src = "img/vect/star-fill.svg";
        favoritoImg.alt = "Marcado como favorito";
    
        if (elemento.favorito) {
            favoritoImg.classList.remove("escondido");
            noFavoritoImg.classList.add("escondido");
        } else {
            favoritoImg.classList.add("escondido");
            noFavoritoImg.classList.remove("escondido");
        }
        botonesGaleria.appendChild(favoritoImg);
    }
    botonesGaleria.appendChild(noFavoritoImg);
    botonesGaleria.appendChild(numFavoritos);
    if(tipo==="admin"){
        const editarImg = document.createElement("img");
        editarImg.className = "boton-galeria editar";
        editarImg.src = "img/vect/pencil-square.svg";
        editarImg.alt = "Editar";

        const guardarImg = document.createElement("img");
        guardarImg.className = "boton-galeria guardar escondido";
        guardarImg.src = "img/vect/guardar.svg";
        guardarImg.alt = "Guardar";

        const eliminarImg = document.createElement("img");
        eliminarImg.className = "boton-galeria eliminar";
        eliminarImg.src = "img/vect/trash.svg";
        eliminarImg.alt = "Eliminar";

        const cancelarImg = document.createElement("img");
        cancelarImg.className = "boton-galeria cancelar escondido";
        cancelarImg.src = "img/vect/cancelar.svg";
        cancelarImg.alt = "Cancelar";

        botonesGaleria.appendChild(editarImg);
        botonesGaleria.appendChild(guardarImg);
        botonesGaleria.appendChild(eliminarImg);
        botonesGaleria.appendChild(cancelarImg);
    }

    const texto = document.createElement("div");
    texto.className = "texto-tapa";

    const parafoBar = document.createElement("p");
    parafoBar.className = "nombreBar";
    const uElementoBar = document.createElement("u");
    uElementoBar.textContent = elemento.bar;
    parafoBar.appendChild(uElementoBar);

    const parafoTapa = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = elemento.titulo;
    parafoTapa.appendChild(strong);

    const descripcionTexto = document.createElement("br");
    parafoTapa.appendChild(descripcionTexto);

    const descripcionParrafo = document.createElement("span");
    descripcionParrafo.textContent = elemento.descripcion;
    parafoTapa.appendChild(descripcionParrafo);

    texto.appendChild(parafoBar);
    texto.appendChild(parafoTapa);

    elementoGrid.appendChild(picture);
    elementoGrid.appendChild(botonesGaleria);
    elementoGrid.appendChild(texto);

    elementoGrid.setAttribute("data-id", elemento.id);

    return elementoGrid;
}

function renderizarControlesPaginacion(elementos) {
    const contenedorPaginacion = document.querySelector(".paginacion");
    contenedorPaginacion.innerHTML = "";

    const totalPaginas = Math.ceil(elementos.length / elementosPorPagina);

    if (paginaActual > 1) {
        const botonAnterior = document.createElement("button");
        botonAnterior.textContent = "Anterior";
        botonAnterior.addEventListener("click", () => {
            paginaActual--;
            renderizarGaleriaConPaginacion(elementos);
        });
        contenedorPaginacion.appendChild(botonAnterior);
    }

    for (let i = 1; i <= totalPaginas; i++) {
        const botonPagina = document.createElement("button");
        botonPagina.textContent = i;
        botonPagina.className = i === paginaActual ? "activo" : "";
        botonPagina.addEventListener("click", () => {
            paginaActual = i;
            renderizarGaleriaConPaginacion(elementos);
        });
        contenedorPaginacion.appendChild(botonPagina);
    }

    if (paginaActual < totalPaginas) {
        const botonSiguiente = document.createElement("button");
        botonSiguiente.textContent = "Siguiente";
        botonSiguiente.addEventListener("click", () => {
            paginaActual++;
            renderizarGaleriaConPaginacion(elementos);
        });
        contenedorPaginacion.appendChild(botonSiguiente);
    }
}

function cambiarFavorito(elemento) {
    const elementoGrid = elemento.closest(".elemento-grid");
    const id = elementoGrid.getAttribute("data-id");

    const favorito = elementoGrid.querySelector(".favorito");
    const noFavorito = elementoGrid.querySelector(".no-favorito");

    favorito.classList.toggle("escondido");
    noFavorito.classList.toggle("escondido");

    const index = tapasArray.findIndex(e => e.id == id);
    if (index !== -1) {
        tapasArray[index].favorito = !tapasArray[index].favorito;
    }
}

async function eliminarTapa(elemento) {
    // Obtener el ID y nombre de la tapa
    const elementoGrid = elemento.closest(".elemento-grid");
    const id = parseInt(elementoGrid.getAttribute("data-id"));
    const nombreTapa = elementoGrid.querySelector(".texto-tapa strong").textContent;

    // Mostrar el nombre de la tapa en el modal
    document.getElementById("nombreTapaEliminar").textContent = nombreTapa;

    // Crear y mostrar el modal de confirmación
    const modal = new bootstrap.Modal(document.getElementById("modalConfirmarEliminacion"));
    modal.show();

    // Agregar el evento de confirmación
    document.getElementById("confirmarEliminacion").addEventListener("click", async () => {
        // Realizar la solicitud DELETE usando fetch
        try {
            const response = await fetch(urlBase+`tapas/?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token // Asegúrate de pasar el JWT correctamente
                }
            });

            // Si la respuesta es exitosa
            if (response.ok) {
                // Eliminar la tapa localmente
                tapasArray = tapasArray.filter(tapa => tapa.id !== id);

                // Volver a renderizar la galería
                renderizarGaleriaConPaginacion(tapasArray);

                // Cerrar el modal
                modal.hide();
            } else {
                // Manejar el error, por ejemplo, mostrar un mensaje de error
                alert('Error al eliminar la tapa. Inténtalo nuevamente.');
            }
        } catch (error) {
            // Manejar cualquier error de la solicitud (ej. problemas de red)
            alert('Error al eliminar la tapa. Inténtalo nuevamente.');
        }
    });
}

function editarTapa(elemento) {
    const elementoGrid = elemento.closest(".elemento-grid");
    const id = parseInt(elementoGrid.getAttribute("data-id"));

    const tituloElemento = elementoGrid.querySelector(".texto-tapa strong");
    const descripcionElemento = elementoGrid.querySelector(".texto-tapa span");
    const parafoBar = elementoGrid.querySelector(".texto-tapa .nombreBar u");

    const inputTitulo = document.createElement("input");
    inputTitulo.type = "text";
    inputTitulo.value = tituloElemento.textContent;
    inputTitulo.id = `titulo-${id}`;

    const textareaDescripcion = document.createElement("textarea");
    textareaDescripcion.value = descripcionElemento.textContent;
    textareaDescripcion.id = `descripcion-${id}`;

    const selectBar = document.createElement("select");
    selectBar.id = `bar-${id}`;

    Object.entries(bares).forEach(([barId, barNombre]) => {
        const option = document.createElement("option");
        option.value = barId;
        option.textContent = barNombre;

        if (barNombre === parafoBar.textContent) {
            option.selected = true;
        }

        selectBar.appendChild(option);
    });

    tituloElemento.replaceWith(inputTitulo);
    descripcionElemento.replaceWith(textareaDescripcion);
    parafoBar.parentElement.replaceChild(selectBar, parafoBar);

    const editar = elementoGrid.querySelector(".editar");
    const guardar = elementoGrid.querySelector(".guardar");
    const eliminar = elementoGrid.querySelector(".eliminar");
    const cancelar = elementoGrid.querySelector(".cancelar");

    editar.classList.add("escondido");
    guardar.classList.remove("escondido");
    eliminar.classList.add("escondido");
    cancelar.classList.remove("escondido");
}

async function guardarCambiosTapa(elemento) {
    const elementoGrid = elemento.closest(".elemento-grid");
    const id = parseInt(elementoGrid.getAttribute("data-id"));
    
    // Obtener los nuevos valores de los campos editados
    const inputTitulo = document.getElementById(`titulo-${id}`);
    const textareaDescripcion = document.getElementById(`descripcion-${id}`);
    const selectBar = document.getElementById(`bar-${id}`);
    
    const nuevoTitulo = inputTitulo.value;
    const nuevaDescripcion = textareaDescripcion.value;
    const nuevoBarId = selectBar.value;  // Enviar el ID del bar directamente
    const nuevoBarNombre = bares[nuevoBarId];
    
    // Crear un objeto con los datos para actualizar la tapa
    const tapaActualizada = {
        id: id,
        titulo: nuevoTitulo,
        descripcion: nuevaDescripcion,
        bar: nuevoBarId,  // Enviar el ID del bar aquí
    };

    try {
        // Enviar la solicitud PUT al backend para actualizar la tapa
        const response = await fetch(urlBase+'tapas/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token, // Aquí debes poner el token JWT
            },
            body: new URLSearchParams(tapaActualizada),
        });

        // Manejo de la respuesta
        if (response.ok) {
            const data = await response.json();
            if (data.id_tapa) {
                // Si la respuesta es exitosa, actualizamos los datos en la interfaz de usuario
                const parafoBar = document.createElement("u");
                parafoBar.textContent = nuevoBarNombre;  // Mostrar el ID del bar (si se desea mostrar el nombre, tendrías que mapearlo)

                const tituloElemento = document.createElement("strong");
                tituloElemento.textContent = nuevoTitulo;

                const descripcionElemento = document.createElement("span");
                descripcionElemento.textContent = nuevaDescripcion;

                // Reemplazar los campos editados por los nuevos valores
                inputTitulo.replaceWith(tituloElemento);
                textareaDescripcion.replaceWith(descripcionElemento);
                selectBar.replaceWith(parafoBar);

                // Cambiar los botones
                const editar = elementoGrid.querySelector(".editar");
                const guardar = elementoGrid.querySelector(".guardar");
                const eliminar = elementoGrid.querySelector(".eliminar");
                const cancelar = elementoGrid.querySelector(".cancelar");

                // Restablecer los botones a su estado original
                editar.classList.remove("escondido");
                guardar.classList.add("escondido");
                eliminar.classList.remove("escondido");
                cancelar.classList.add("escondido");
            }
        } else {
            console.error("Error al guardar los cambios:", response.statusText);
        }
    } catch (error) {
        console.error("Hubo un error con la solicitud:", error);
    }
}

function cancelarCambiosTapa(elemento) {
    const elementoGrid = elemento.closest(".elemento-grid");
    const id = parseInt(elementoGrid.getAttribute("data-id"));

    const inputTitulo = document.getElementById(`titulo-${id}`);
    const textareaDescripcion = document.getElementById(`descripcion-${id}`);
    const selectBar = document.getElementById(`bar-${id}`);

    let titulo = "";
    let descripcion = "";
    let bar = "";
    const index = tapasArray.findIndex(e => e.id == id);
    if (index !== -1) {
        titulo = tapasArray[index].titulo;
        descripcion = tapasArray[index].descripcion;
        bar = tapasArray[index].bar;
    }
    
    const parafoBar = document.createElement("u");
    parafoBar.textContent = bar;

    const tituloElemento = document.createElement("strong");
    tituloElemento.textContent = titulo;

    const descripcionElemento = document.createElement("span");
    descripcionElemento.textContent = descripcion;

    inputTitulo.replaceWith(tituloElemento);
    textareaDescripcion.replaceWith(descripcionElemento);
    selectBar.replaceWith(parafoBar);

    const editar = elementoGrid.querySelector(".editar");
    const guardar = elementoGrid.querySelector(".guardar");
    const eliminar = elementoGrid.querySelector(".eliminar");
    const cancelar = elementoGrid.querySelector(".cancelar");

    editar.classList.remove("escondido");
    guardar.classList.add("escondido");
    eliminar.classList.remove("escondido");
    cancelar.classList.add("escondido");
}