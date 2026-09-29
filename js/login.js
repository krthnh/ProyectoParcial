import { iniciarSesion, registrarUsuario } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo de Pestañas (Login / Registro)
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const authMsg = document.getElementById('auth-msg');

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            formLogin.style.display = 'block';
            formRegister.style.display = 'none';
            ocultarMensaje();
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            formRegister.style.display = 'block';
            formLogin.style.display = 'none';
            ocultarMensaje();
        });
    }

    // 2. Procesar INICIO DE SESIÓN
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const correo = document.getElementById('login-correo').value.trim();
            const contrasena = document.getElementById('login-password').value.trim();

            const usuario = await iniciarSesion(correo, contrasena);

            if (usuario) {
                mostrarMensaje(`¡Bienvenido ${usuario.nombre}! Cargando...`, 'exito');

                // Redirección adaptada a roles de Neon SQL
                setTimeout(() => {
                    if (usuario.rol === 'admin' || usuario.rol === 'empleado') {
                        window.location.href = 'panel.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1000);
            } else {
                mostrarMensaje('Correo o contraseña incorrectos', 'error');
            }
        });
    }

    // 3. Procesar REGISTRO DE CUENTA (Por defecto registra como 'cliente')
    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('reg-nombre').value.trim();
            const correo = document.getElementById('reg-correo').value.trim();
            const contrasena = document.getElementById('reg-password').value.trim();
            
            // Capturamos el rol seleccionado en el formulario
            const rol = document.getElementById('reg-rol').value;

            // Enviamos el rol seleccionado como 4to parámetro
            const res = await registrarUsuario(nombre, correo, contrasena, rol);

            if (res.ok) {
                mostrarMensaje('Cuenta creada con éxito. Ya puedes iniciar sesión.', 'exito');
                formRegister.reset();
                setTimeout(() => tabLogin.click(), 1500);
            } else {
                mostrarMensaje('Error al registrar: ' + res.error, 'error');
            }
        });
    }

    // Auxiliares de interfaz
    function mostrarMensaje(msg, tipo) {
        if (!authMsg) return;
        authMsg.textContent = msg;
        authMsg.style.display = 'block';
        authMsg.style.color = tipo === 'exito' ? '#155724' : '#721c24';
        authMsg.style.backgroundColor = tipo === 'exito' ? '#d4edda' : '#f8d7da';
        authMsg.style.padding = '10px';
        authMsg.style.borderRadius = '5px';
    }

    function ocultarMensaje() {
        if (authMsg) authMsg.style.display = 'none';
    }
});