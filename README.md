# galeria-tapas

El carrusel cambia de imágenes automáticamente, y a voluntad del usuario con las flechas laterales y los botones inferiores.

Las imágenes usadas pertenecen a pexels.com y pixabay.com, que permiten una licencia de uso gratuito sin atribución y con modificación para fines no comerciales.
Licencias:
https://www.pexels.com/es-es/license/
https://pixabay.com/es/service/license-summary/

Para optimizar las imágenes hemos utilizado un formato .webp. Para convertir las imágenes hemos usado https://convertio.co/es/ y para escalarlas a diferentes resoluciones hemos usado https://products.aspose.app/imaging/es/image-resize/webp

Para la galería hemos hecho un grid adaptativo para diferentes tamaños máximos de pantalla, para que sea visible en diferentes dispositivos. El carrusel también se adapta a diferentes tamaños. Todas las imágenes tienen carga perezosa.

Para el logo y los iconos del footer se han usado imágenes vectoriales. El logo fue generado con IA, adaptado con Photoshop y convertido a svg con https://convertio.co/es/

La estética general es simple, en escala de grises y fondo oscuro, con los elementos de la galería en color contrastante.

-----------------------------------------------------------------------------------

Galería interactiva con DOM:

La galería se genera dinámicamente utilizando DOM, estando los datos en un JSON que se carga en un array en memoria, y las operaciones de editar, eliminar y añadir se ejecutan sobre este array.

Hemos añadido botones para añadir y quitar favoritos, que se alternan según si ya están marcados o no, y se pueden filtrar para poder mostrar todas las tapas o solo las marcadas como favoritas.
También se han añadido botones de editar y eliminar cada tapa. En caso de editar la tapa, ambos botones se sustituyen por guardar y cancelar cambios respectivamente, y el bar, título y descripción de la tapa se cambiarán a campos de texto (reemplazando cada texto por su campo usando DOM) para ser editados en su mismo sitio. Al guardar o cancelar, los campos de texto vuelven a ser texto plano, modificándose si se han guardado los cambios o volviendo al texto original si se han cancelado.
Los botones de cada tapa se muestran y se esconden añadiendo o eliminando una clase mediante DOM.

Se ha añadido una opción para añadir nuevas tapas después de la galería. Al pulsar el botón para añadir una nueva tapa, se redirige a una nueva pestaña en la que introducir la información de la tapa, con un campo para el título de la tapa, descripción y nombre del bar. También hay un campo opcional para el nombre de archivo de imagen (ejemplo: tapa13.webp). Si no se introduce una imagen, se mostrará una por defecto.

La galería conserva la estética original, añadiendo una sección bajo la foto de cada tapa con los distintos botones, dos botones de filtrado antes de la galería y una sección al final de la galería para añadir una nueva tapa, siguiendo lo anteriormente hablado. Se han usado siete imagenes vectoriales nuevas para estos botones, los cuales tienen un efecto de cambio de color según su función al pasar el puntero sobre ellos.

-----------------------------------------------------------------------------------

Estudio Usabilidad:

-----------------------------------------------------------------------------------

Diseño Adaptativo:
En las resoluciones más grandes (>1100px), la galería se dividirá en 3 columnas, en resoluciones de 1099px a 500px se dividirá en 2 y en resoluciones menores en 1. La resolución y tamaño de las imágenes del carrusel también se adapta a esas 3 resoluciones.
Los textos usan unidades "rem", por lo que tienen un tamaño responsivo.