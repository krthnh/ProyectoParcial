import { verificarSesion } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Control de sesión (si no está en login.html, verifica que esté logueado)
    if (!window.location.pathname.includes('login.html')) {
        verificarSesion();
    }

    // Lógica del formulario SAT
    const satForm = document.querySelector('.sat-form');
    const submitBtn = satForm ? satForm.querySelector('.animated-btn') : null;
    const resultsContainer = document.getElementById('resultados');

    if (satForm && submitBtn && resultsContainer) {
        satForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btnText = submitBtn.querySelector('span');
            const originalText = btnText.textContent;
            
            btnText.textContent = 'Buscando registros...';
            submitBtn.style.opacity = '0.75';
            submitBtn.disabled = true;

            setTimeout(() => {
                btnText.textContent = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;

                resultsContainer.classList.add('active');
                resultsContainer.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        });
    }
});