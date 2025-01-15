document.getElementById("form-tapa").addEventListener("submit", (event) => {
    event.preventDefault();

    const nuevaTapa = {
        id: 0,
        titulo: document.getElementById('titulo').value,
        descripcion: document.getElementById('descripcion').value,
        bar: document.getElementById('bar').value,
        imagen: document.getElementById('imagen').value,
        favorito: false,
        numFavoritos: 0
    };

    sessionStorage.setItem("nuevaTapa", JSON.stringify(nuevaTapa));

    window.location.href = "index.html";
});
