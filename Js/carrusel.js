
/* Carrusel de Ofertas */

document.addEventListener('DOMContentLoaded', () => {
    const carouselOfertas = document.getElementById('carouselOfertas');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');
    
    if (!carouselOfertas) return;

    const items = Array.from(carouselOfertas.querySelectorAll('.carouselItemsOfertas'));// Todos los elementos del carrusel
    const totalItems = items.length;// Número total de elementos en el carrusel
    if (totalItems === 0) return;// Evita errores si no hay elementos

    let currentIndex = 0;
    // 2. Creación de Indicadores (Puntos de Navegación)
    if (indicatorsContainer) {// Verifica si el contenedor de indicadores existe
        indicatorsContainer.innerHTML = '';// Limpia cualquier indicador existente
        items.forEach((_, i) => {// Usa un guion bajo para indicar que el primer parámetro no se usa
            const dot = document.createElement('button');// Cambiado a 'button' para accesibilidad
            dot.type = 'button';// Asegura que el botón no envíe formularios
            dot.className = 'carousel-dot';// Clase para estilos
            dot.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);// Mejora de accesibilidad
            dot.dataset.index = i;// Almacena el índice de la diapositiva
            if (i === 0) dot.classList.add('active');// Marca el primer punto como activo
            dot.addEventListener('click', () => { goToSlide(i); });// Navegación al hacer clic
            indicatorsContainer.appendChild(dot);// Añade el punto al contenedor
        });
    }

    function updateIndicators() {// Actualiza el estado activo de los indicadores
        const dots = indicatorsContainer ? Array.from(indicatorsContainer.querySelectorAll('.carousel-dot')) : [];// Verifica si el contenedor de indicadores existe
        dots.forEach((d, idx) => d.classList.toggle('active', idx === currentIndex));// Activa o desactiva según el índice actual
    }

    function goToSlide(index) {// Navega a una diapositiva específica
        currentIndex = (index + totalItems) % totalItems;// Manejo de índice circular
        carouselOfertas.style.transform = `translateX(-${currentIndex * 100}%)`;// Mueve el carrusel
        updateIndicators();// Actualiza los indicadores
    }

    function nextSlide() { goToSlide(currentIndex + 1); }// Navega a la siguiente diapositiva
    function prevSlide() { goToSlide(currentIndex - 1); }// Navega a la diapositiva anterior

    // listeners corregidos
    nextBtn && nextBtn.addEventListener('click', nextSlide);// Verifica si el botón existe antes de agregar el listener
    prevBtn && prevBtn.addEventListener('click', prevSlide);// Verifica si el botón existe antes de agregar el listener

    // Inicialización del carrusel

    carouselOfertas.style.transition = carouselOfertas.style.transition || 'transform 0.5s ease';
    goToSlide(0);
});

// --- Carrusel Categorías: mostrar 3 por vista y navegar por botones

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('carouselCategorias');
    const prev = document.getElementById('prevCategoriasBtn');
    const next = document.getElementById('nextCategoriasBtn');
    const indicatorsCat = document.getElementById('indicatorsCategorias');

    if (!container) return;

    const items = Array.from(container.querySelectorAll('.carouselItemsCategorias'));
    const total = items.length;
    function itemsPerView() {
        if (window.matchMedia('(max-width:520px)').matches) return 1;
        if (window.matchMedia('(max-width:900px)').matches) return 2;
        return 3;
    }

    let perView = itemsPerView();
    let maxIndex = Math.max(0, total - perView);
    let index = 0;

    function updateLayout() {
        perView = itemsPerView();
        maxIndex = Math.max(0, total - perView);
        // asegúrate de que el índice esté dentro de rango tras el resize
        if (index > maxIndex) index = maxIndex;
        goTo(index);
        renderIndicators();
    }

    function goTo(i) {
        index = i;
        // Clamp index por seguridad (aunque next/prev hacen wrap)
        if (index < 0) index = 0;
        if (index > maxIndex) index = maxIndex;
        const shiftPercent = (100 / perView) * index;
        container.style.transform = `translateX(-${shiftPercent}%)`;
        // no deshabilitamos botones (wrap), solo actualizamos indicadores
        updateIndicatorState();
    }

    function nextSlide() {
        // wrap hacia delante
        if (maxIndex === 0) {
            goTo(0);
            return;
        }
        const nextIndex = index >= maxIndex ? 0 : index + 1;
        goTo(nextIndex);
    }

    function prevSlide() {
        // wrap hacia atrás
        if (maxIndex === 0) {
            goTo(0);
            return;
        }
        const prevIndex = index <= 0 ? maxIndex : index - 1;
        goTo(prevIndex);
    }

    function renderIndicators() {
        if (!indicatorsCat) return;
        indicatorsCat.innerHTML = '';
        const dotsCount = maxIndex + 1;
        for (let i = 0; i < dotsCount; i++) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'carousel-dot';
            b.dataset.index = i;
            b.setAttribute('aria-label', `Página ${i + 1}`);
            b.addEventListener('click', () => goTo(i));
            indicatorsCat.appendChild(b);
        }
        updateIndicatorState();
    }

    function updateIndicatorState() {
        if (!indicatorsCat) return;
        const dots = Array.from(indicatorsCat.children);
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    // eventos
    next && next.addEventListener('click', nextSlide);
    prev && prev.addEventListener('click', prevSlide);
    window.addEventListener('resize', () => {
        setTimeout(updateLayout, 80);
    });

    // init
    container.style.transition = 'transform 0.5s ease';
    updateLayout();
});