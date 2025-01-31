let elementos = [];

let paginaActual = 1;
const elementosPorPagina = 6;

document.querySelector(".boton-login").addEventListener("click", (event) => {
    window.location.href = "html/login.html";
});

document.getElementById("mostrar-todos").addEventListener("click", (event) => {
    event.preventDefault();
    renderizarGaleria(elementos);
});

document.getElementById("mostrar-favoritos").addEventListener("click", (event) => {
    event.preventDefault();
    const favoritos = elementos.filter(elemento => elemento.favorito);
    renderizarGaleria(favoritos);
});

document.querySelector(".grid-galeria").addEventListener("click", (event) => {
    const clickedElement = event.target;

    if (clickedElement.classList.contains("no-favorito") || clickedElement.classList.contains("favorito")) {
        cambiarFavorito(clickedElement);
    }else if(clickedElement.classList.contains("editar")){
        editarTapa(clickedElement);
    }else if(clickedElement.classList.contains("eliminar")){
        eliminarTapa(clickedElement);
    }else if(clickedElement.classList.contains("guardar")){
        guardarCambiosTapa(clickedElement);
    }else if(clickedElement.classList.contains("cancelar")){
        cancelarCambiosTapa(clickedElement);
    }
});

function agregarTapa(nuevaTapa) {
    const ultimoElemento = elementos[elementos.length - 1];
    const nuevoId = ultimoElemento ? ultimoElemento.id + 1 : 0;

    nuevaTapa.id = nuevoId;
    if(nuevaTapa.imagen === ""){
        nuevaTapa.imagen = "default.jpg"
    }

    elementos.push(nuevaTapa);
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("data/elementos.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al cargar el archivo JSON");
        }
        return response.json();
    })
    .then(data => {
        elementos = data.elementos;
        const nuevaTapa = JSON.parse(sessionStorage.getItem("nuevaTapa"));

        if (nuevaTapa) {
            agregarTapa(nuevaTapa);

            sessionStorage.removeItem("nuevaTapa");
        }
        renderizarGaleriaConPaginacion(elementos);
    })
    .catch(error => {
        console.error("Hubo un problema con la carga del archivo JSON:", error);
    });
});

function renderizarGaleriaConPaginacion(elementos) {
    const inicio = (paginaActual-1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const elementosPagina = elementos.slice(inicio, fin);

    renderizarGaleria(elementosPagina);
    renderizarControlesPaginacion();
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

    const imagen = elemento.imagen;

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
    
    const favoritoBtn = document.createElement("button");
    favoritoBtn.className = "boton-galeria favorito";
    favoritoBtn.setAttribute("aria-label", "Marcado como favorito");
    const favoritoImg = document.createElement("img");
    favoritoImg.className = "boton-galeria";
    favoritoImg.src = "img/vect/star-fill.svg";
    favoritoBtn.appendChild(favoritoImg);

    const noFavoritoBtn = document.createElement("button");
    noFavoritoBtn.className = "boton-galeria no-favorito";
    noFavoritoBtn.setAttribute("aria-label", "Marcar como favorito");
    const noFavoritoImg = document.createElement("img");
    noFavoritoImg.className = "boton-galeria";
    noFavoritoImg.src = "img/vect/star.svg";
    noFavoritoBtn.appendChild(noFavoritoImg);

    if (elemento.favorito) {
        favoritoImg.classList.remove("escondido");
        noFavoritoImg.classList.add("escondido");
    } else {
        favoritoImg.classList.add("escondido");
        noFavoritoImg.classList.remove("escondido");
    }

    const numFavoritos = document.createElement("p");
    numFavoritos.textContent = elemento.numFavoritos;
    numFavoritos.className = "numFavoritos";

    const editarBtn = document.createElement("button");
    editarBtn.className = "boton-galeria editar";
    editarBtn.setAttribute("aria-label", "Editar");
    const editarImg = document.createElement("img");
    editarImg.className = "boton-galeria";
    editarImg.src = "img/vect/pencil-square.svg";
    editarBtn.appendChild(editarImg);

    const guardarBtn = document.createElement("button");
    guardarBtn.className = "boton-galeria guardar escondido";
    guardarBtn.setAttribute("aria-label", "Guardar");
    const guardarImg = document.createElement("img");
    guardarImg.className = "boton-galeria";
    guardarImg.src = "img/vect/guardar.svg";
    guardarBtn.appendChild(guardarImg);

    const eliminarBtn = document.createElement("button");
    eliminarBtn.className = "boton-galeria eliminar";
    eliminarBtn.setAttribute("aria-label", "Eliminar");
    const eliminarImg = document.createElement("img");
    eliminarImg.className = "boton-galeria";
    eliminarImg.src = "img/vect/trash.svg";
    eliminarBtn.appendChild(eliminarImg);

    const cancelarBtn = document.createElement("button");
    cancelarBtn.className = "boton-galeria cancelar escondido";
    cancelarBtn.setAttribute("aria-label", "Cancelar");
    const cancelarImg = document.createElement("img");
    cancelarImg.className = "boton-galeria";
    cancelarImg.src = "img/vect/cancelar.svg";
    cancelarBtn.appendChild(cancelarImg);

    const botonesGaleria = document.createElement("div");
    botonesGaleria.className = "botones-galeria";
    botonesGaleria.appendChild(favoritoBtn);
    botonesGaleria.appendChild(noFavoritoBtn);
    botonesGaleria.appendChild(numFavoritos);
    botonesGaleria.appendChild(editarBtn);
    botonesGaleria.appendChild(guardarBtn);
    botonesGaleria.appendChild(eliminarBtn);
    botonesGaleria.appendChild(cancelarBtn);

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

function renderizarControlesPaginacion() {
    const contenedorPaginacion = document.querySelector(".paginacion");
    contenedorPaginacion.innerHTML = ""; // Limpia los controles existentes

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

    const index = elementos.findIndex(e => e.id == id);
    if (index !== -1) {
        elementos[index].favorito = !elementos[index].favorito;
    }
}

function eliminarTapa(elemento){
    const elementoGrid = elemento.closest(".elemento-grid");
    const id = parseInt(elementoGrid.getAttribute("data-id"));

    const nombreTapa = elementoGrid.querySelector(".texto-tapa strong").textContent;

    document.getElementById("nombreTapaEliminar").textContent = nombreTapa;

    const modal = new bootstrap.Modal(document.getElementById("modalConfirmarEliminacion"));
    modal.show();

    document.getElementById("modalConfirmarEliminacion").focus();

    document.getElementById("confirmarEliminacion").addEventListener("click", () => {
        if (id !== null) {
            elementos = elementos.filter(elemento => elemento.id !== id);

            renderizarGaleria(elementos);

            const modal = bootstrap.Modal.getInstance(document.getElementById("modalConfirmarEliminacion"));
            modal.hide();
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

    const inputBar = document.createElement("input");
    inputBar.type = "text";
    inputBar.value = parafoBar.textContent;
    inputBar.id = `bar-${id}`;

    tituloElemento.replaceWith(inputTitulo);
    descripcionElemento.replaceWith(textareaDescripcion);
    parafoBar.parentElement.replaceChild(inputBar, parafoBar);

    const editar = elementoGrid.querySelector(".editar");
    const guardar = elementoGrid.querySelector(".guardar");
    const eliminar = elementoGrid.querySelector(".eliminar");
    const cancelar = elementoGrid.querySelector(".cancelar");

    editar.classList.add("escondido");
    guardar.classList.remove("escondido");
    eliminar.classList.add("escondido");
    cancelar.classList.remove("escondido");
}

function guardarCambiosTapa(elemento) {
    const elementoGrid = elemento.closest(".elemento-grid");
    const id = parseInt(elementoGrid.getAttribute("data-id"));

    const inputTitulo = document.getElementById(`titulo-${id}`);
    const textareaDescripcion = document.getElementById(`descripcion-${id}`);
    const inputBar = document.getElementById(`bar-${id}`);

    const nuevoTitulo = inputTitulo.value;
    const nuevaDescripcion = textareaDescripcion.value;
    const nuevoBar = inputBar.value;

    const index = elementos.findIndex(e => e.id == id);
    if (index !== -1) {
        elementos[index].titulo = nuevoTitulo;
        elementos[index].descripcion = nuevaDescripcion;
        elementos[index].bar = nuevoBar;
    }

    const parafoBar = document.createElement("u");
    parafoBar.textContent = nuevoBar;

    const tituloElemento = document.createElement("strong");
    tituloElemento.textContent = nuevoTitulo;

    const descripcionElemento = document.createElement("span");
    descripcionElemento.textContent = nuevaDescripcion;

    inputTitulo.replaceWith(tituloElemento);
    textareaDescripcion.replaceWith(descripcionElemento);
    inputBar.replaceWith(parafoBar);

    const editar = elementoGrid.querySelector(".editar");
    const guardar = elementoGrid.querySelector(".guardar");
    const eliminar = elementoGrid.querySelector(".eliminar");
    const cancelar = elementoGrid.querySelector(".cancelar");

    editar.classList.remove("escondido");
    guardar.classList.add("escondido");
    eliminar.classList.remove("escondido");
    cancelar.classList.add("escondido");
}

function cancelarCambiosTapa(elemento) {
    const elementoGrid = elemento.closest(".elemento-grid");
    const id = parseInt(elementoGrid.getAttribute("data-id"));

    const inputTitulo = document.getElementById(`titulo-${id}`);
    const textareaDescripcion = document.getElementById(`descripcion-${id}`);
    const inputBar = document.getElementById(`bar-${id}`);

    let titulo = "";
    let descripcion = "";
    let bar = "";
    const index = elementos.findIndex(e => e.id == id);
    if (index !== -1) {
        titulo = elementos[index].titulo;
        descripcion = elementos[index].descripcion;
        bar = elementos[index].bar;
    }
    
    const parafoBar = document.createElement("u");
    parafoBar.textContent = bar;

    const tituloElemento = document.createElement("strong");
    tituloElemento.textContent = titulo;

    const descripcionElemento = document.createElement("span");
    descripcionElemento.textContent = descripcion;

    inputTitulo.replaceWith(tituloElemento);
    textareaDescripcion.replaceWith(descripcionElemento);
    inputBar.replaceWith(parafoBar);

    const editar = elementoGrid.querySelector(".editar");
    const guardar = elementoGrid.querySelector(".guardar");
    const eliminar = elementoGrid.querySelector(".eliminar");
    const cancelar = elementoGrid.querySelector(".cancelar");

    editar.classList.remove("escondido");
    guardar.classList.add("escondido");
    eliminar.classList.remove("escondido");
    cancelar.classList.add("escondido");
}