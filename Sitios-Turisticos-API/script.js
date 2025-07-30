if (document.getElementById('pagina-slider')) {
    fetch("API´s/lugares.json")
        .then(response => response.json())
        .then(data => {
            const slider = document.getElementById('slider');

            data.forEach(lugar => {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'destinos';

                tarjeta.innerHTML = `
                    <h2 class="titulo-destino">${lugar.nombre}</h2>
                    <img src="${lugar.url_imagen}" alt="${lugar.nombre}">
                `;

                slider.appendChild(tarjeta);
            });
        })
        .catch(error => console.error('Error cargando JSON:', error));
}


function scrollSlider(direction) {
    const slider = document.querySelector('.slider');
    const scrollAmount = 400;
    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}