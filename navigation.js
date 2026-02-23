document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const buttons = document.querySelectorAll('button, a');

    console.log('Navigation initialized on path:', path);

    buttons.forEach(btn => {
        const text = btn.innerText.toLowerCase().trim();
        const html = btn.innerHTML.toLowerCase();

        // Bienvenida -> Pensamiento
        if (path.includes('bienvenida') && (text.includes('animar') || text.includes('respuesta'))) {
            btn.onclick = (e) => { e.preventDefault(); window.location.href = '/asistente__pensamiento_profundo/'; };
        }

        // Pensamiento -> Generated Screen
        if (path.includes('pensamiento') && (text.includes('animar') || text.includes('respuesta'))) {
            btn.onclick = (e) => { e.preventDefault(); window.location.href = '/generated_screen/'; };
        }

        // Success -> Logros
        if (path.includes('generated_screen') && text.includes('continuar')) {
            btn.onclick = (e) => { e.preventDefault(); window.location.href = '/resumen_de_logros/'; };
        }

        // Logros -> Logros del día (Detalles)
        if (path.includes('resumen_de_logros') && (text.includes('logros') || text.includes('hoy') || text.includes('certificado'))) {
            btn.onclick = (e) => { e.preventDefault(); window.location.href = '/logros_del_día/'; };
        }

        // Logros del día -> Resumen Detallado
        if (path.includes('logros_del_día') && text.includes('continuar')) {
            btn.onclick = (e) => { e.preventDefault(); window.location.href = '/resumen_detallado_de_sesión/'; };
        }

        // Resumen Detallado -> Despedida
        if (path.includes('resumen_detallado_de_sesión') && text.includes('lección')) {
            btn.onclick = (e) => { e.preventDefault(); window.location.href = '/asistente__situación_de_despedida/'; };
        }

        // Despedida -> Home
        if (path.includes('despedida') && (text.includes('inicio') || text.includes('gracias') || text.includes('finalizar'))) {
            btn.onclick = (e) => { e.preventDefault(); window.location.href = '/'; };
        }

        // Back buttons
        if (html.includes('arrow_back')) {
            btn.onclick = (e) => { e.preventDefault(); window.history.back(); };
        }

        // Home links in nav
        if (text.includes('inicio')) {
            btn.onclick = (e) => { e.preventDefault(); window.location.href = '/'; };
        }
    });

    // Auto-advance for "Pensando" for better UX
    if (path.includes('pensamiento')) {
        console.log('Thinking... will auto-advance in 3s');
        setTimeout(() => {
            // window.location.href = '/generated_screen/';
        }, 3000);
    }
});
