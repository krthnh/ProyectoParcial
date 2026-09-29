import { sql } from './neon-config.js';

// Registrar usuario en la tabla 'usuarios' con su rol (por defecto 'empleado')
export async function registrarUsuario(nombre, correo, contrasena, rol = 'empleado') {
    try {
        await sql`
            INSERT INTO usuarios (nombre, correo, contrasena, rol)
            VALUES (${nombre}, ${correo}, ${contrasena}, ${rol})
        `;
        return { ok: true };
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        return { ok: false, error: error.message };
    }
}

// Iniciar sesión (obtiene id, nombre, correo, rol y turno)
export async function iniciarSesion(correo, contrasena) {
    try {
        const filas = await sql`
            SELECT id, nombre, correo, rol, turno FROM usuarios
            WHERE correo = ${correo} AND contrasena = ${contrasena}
        `;

        if (filas.length === 0) {
            return null;
        }

        // Guarda en sessionStorage incluyendo el rol y turno
        sessionStorage.setItem('usuario', JSON.stringify(filas[0]));
        return filas[0];
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return null;
    }
}

// Cerrar sesión
export function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

// Verificar si hay una sesión activa
export function verificarSesion() {
    const usuarioGuardado = sessionStorage.getItem('usuario');
    if (!usuarioGuardado) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(usuarioGuardado);
}

// Verificar si el usuario en sesión es administrador
export function esAdmin() {
    const usuario = verificarSesion();
    return usuario && usuario.rol === 'admin';
}