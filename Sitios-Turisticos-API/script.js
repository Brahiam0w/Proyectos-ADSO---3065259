if (document.getElementById('pagina-slider')) {
    fetch("API´s/lugares.json")
        .then(response => response.json())
        .then(data => {
            const slider = document.getElementById('slider');

            data.forEach(lugar => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'destinos';
                const img = document.createElement('img');
                img.src = lugar.url_imagen;
                img.alt = lugar.nombre;
                img.addEventListener('click', () => {
                    localStorage.setItem("lugarSeleccionado", JSON.stringify(lugar));
                    console.log("Guardado en localStorage:", lugar);
                    window.location.href = "tarjetas.html";
                });
                tarjeta.innerHTML = `<h2 class="titulo-destino">${lugar.nombre}</h2>`;
                tarjeta.appendChild(img);
                slider.appendChild(tarjeta);
            });
        })
        .catch(error => console.error('Error cargando JSON:', error));
}


if (document.getElementById('pagina-tarjetas')) {
    const lugar = JSON.parse(localStorage.getItem("lugarSeleccionado"));

    if (lugar) {
        const contenedor = document.getElementById('viewport-tarjetas');
        contenedor.style.backgroundImage = `url(${lugar.url_imagen})`;
        contenedor.style.backgroundSize = "cover";
        contenedor.style.backgroundPosition = "center";

        contenedor.innerHTML = `
        <div id="contenido-tarjetas">
            <div id="info-1">
                <div>
                    <p>WELCOME TO</p>
                    <p id="ciudad">${lugar.ciudad}</p>
                    <p id="pais">${lugar.pais}</p>
                </div>
                <div>
                    <p id="Descripcion-info-1">${lugar.descripcion}</p>
                </div>
            </div>
            <div id="info-2">
                <div>
                    <p id="nombre">${lugar.nombre}</p>
                </div>
                <div id="actividades-recomendadas">
                    <h2>Actividades Recomendadas:</h2>
                    <ul id="lista-actividades"></ul>
                </div>
            </div>
        </div>
        `;

        const lista = document.getElementById('lista-actividades');
        lugar.actividadesRecomendadas.forEach(actividad => {
            const item = document.createElement('li');
            item.textContent = actividad;
            lista.appendChild(item);
        });

    } else {
        document.getElementById('viewport-tarjetas').innerHTML = "<p>No se encontró información del lugar.</p>";
    }
}



function scrollSlider(direction) {
    const slider = document.querySelector('.slider');
    const scrollAmount = 450;
    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}