
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

/* Carrusel de Novedades */

function initCarousel(options) {
    const {
        containerSel, itemSel, prevSel, nextSel, indicatorsSel,
        perViewCalc = () => 1, wrap = false
    } = options;

    const container = document.querySelector(containerSel);
    if (!container) return null;

    const items = Array.from(container.querySelectorAll(itemSel));
    if (!items.length) return null;

    const prevBtn = prevSel ? document.querySelector(prevSel) : null;
    const nextBtn = nextSel ? document.querySelector(nextSel) : null;
    const indicators = indicatorsSel ? document.querySelector(indicatorsSel) : null;

    let perView = Math.max(1, perViewCalc());
    let maxIndex = Math.max(0, items.length - perView);
    let index = 0;

    function recalc() {
        perView = Math.max(1, perViewCalc());
        maxIndex = Math.max(0, items.length - perView);
        if (index > maxIndex) index = wrap ? 0 : maxIndex;
        renderIndicators();
        goTo(index);
    }

    function goTo(i) {
        if (wrap) {
            const pages = maxIndex + 1;
            if (pages > 0) i = ((i % pages) + pages) % pages;
            else i = 0;
        } else {
            if (i < 0) i = 0;
            if (i > maxIndex) i = maxIndex;
        }
        index = i;
        const shiftPercent = (100 / perView) * index;
        container.style.transform = `translateX(-${shiftPercent}%)`;
        updateIndicators();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function renderIndicators() {
        if (!indicators) return;
        indicators.innerHTML = '';
        const pages = Math.max(1, maxIndex + 1);
        for (let i = 0; i < pages; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'carousel-dot';
            btn.dataset.index = i;
            btn.setAttribute('aria-label', `Página ${i + 1}`);
            btn.addEventListener('click', () => goTo(i));
            indicators.appendChild(btn);
        }
        updateIndicators();
    }

    function updateIndicators() {
        if (!indicators) return;
        Array.from(indicators.children).forEach((d, i) => d.classList.toggle('active', i === index));
    }

    // listeners
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); });
    window.addEventListener('resize', () => { setTimeout(recalc, 80); });

    // touch swipe (simple)
    (function addTouch() {
        let startX = 0, moved = false;
        container.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            moved = false;
        }, {passive: true});
        container.addEventListener('touchmove', e => {
            const dx = e.touches[0].clientX - startX;
            if (Math.abs(dx) > 10) moved = true;
        }, {passive: true});
        container.addEventListener('touchend', e => {
            if (!moved) return;
            const dx = (e.changedTouches[0].clientX - startX);
            if (dx < -30) next();
            if (dx > 30) prev();
        });
    })();

    // init styles & render
    container.style.transition = container.style.transition || 'transform 0.5s ease';
    // ensure container has will-change for smoother transform
    container.style.willChange = 'transform';
    recalc();

    return { goTo, next, prev, recalc };
}

// inicializaciones específicas según tu CSS/HTML

document.addEventListener('DOMContentLoaded', () => {
    // Ofertas: 1 por vista, wrap circular
    initCarousel({
        containerSel: '#carouselOfertas',
        itemSel: '.carouselItemsOfertas',
        prevSel: '#prevBtn',
        nextSel: '#nextBtn',
        indicatorsSel: '#indicators',
        perViewCalc: () => 1,
        wrap: true
    });

    // Categorías: responsive 3/2/1, wrap circular
    initCarousel({
        containerSel: '#carouselCategorias',
        itemSel: '.carouselItemsCategorias',
        prevSel: '#prevCategoriasBtn',
        nextSel: '#nextCategoriasBtn',
        indicatorsSel: '#indicatorsCategorias',
        perViewCalc: () => {
            if (window.matchMedia('(max-width:520px)').matches) return 1;
            if (window.matchMedia('(max-width:900px)').matches) return 2;
            return 3;
        },
        wrap: true
    });

    // Novedades: usa las mismas reglas que categorías (3/2/1)
    initCarousel({
        containerSel: '#carouselNovedades',
        itemSel: '.carouselItemsNovedades',
        prevSel: '#prevNovedadesBtn',
        nextSel: '#nextNovedadesBtn',
        indicatorsSel: '#indicatorsNovedades',
        perViewCalc: () => {
            if (window.matchMedia('(max-width:520px)').matches) return 1;
            if (window.matchMedia('(max-width:900px)').matches) return 2;
            return 3;
        },
        wrap: true
    });
});

