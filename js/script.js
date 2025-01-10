let slideIndex = 1;
showSlides(slideIndex);

const tiempo = 3000
let intervalo = setInterval(autoSlide, tiempo);

function autoSlide() {
  plusSlides(1);
}

function resetAutoSlide() {
  clearInterval(intervalo);
  intervalo = setInterval(autoSlide, tiempo);
}

function plusSlides(n) {
  resetAutoSlide();
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  resetAutoSlide();
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let botones = document.getElementsByClassName("boton");
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < botones.length; i++) {
    botones[i].className = botones[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  botones[slideIndex - 1].className += " active";
}

document.addEventListener("DOMContentLoaded", () => {
    const gridGaleria = document.querySelector(".grid-galeria");
    addEventoFavorito(gridGaleria);
});

function addEventoFavorito(container) {
    container.addEventListener("click", (event) => {
        const clickedElement = event.target;

        if (clickedElement.classList.contains("no-favorito") || clickedElement.classList.contains("favorito")) {
            cambiarFavorito(clickedElement);
        }
    });
}

function cambiarFavorito(elemento) {
    const elementoGrid = elemento.closest(".elemento-grid");

    const favorito = elementoGrid.querySelector(".favorito");
    const noFavorito = elementoGrid.querySelector(".no-favorito");

    favorito.classList.toggle("escondido");
    noFavorito.classList.toggle("escondido");
}
