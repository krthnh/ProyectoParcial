import { sql } from './neon-config.js';
import { verificarSesion } from './auth.js';

const usuario = verificarSesion();

// RF-33.7 / RF-33.8: Consultar registros con filtro por turno para empleados
export async function obtenerTodosLosReclamos() {
    try {
        // 1. Si es Administrador, devuelve TODOS los registros
        if (!usuario || usuario.rol === 'admin') {
            return await sql`
                SELECT r.id, r.codigo_seguimiento, r.nombre_propietario, r.dni, r.tipo_impuesto, r.motivo, r.estado, r.fecha_registro, u.nombre as registrado_por
                FROM reclamos_tributarios r
                LEFT JOIN usuarios u ON r.usuario_id = u.id
                ORDER BY r.fecha_registro DESC
            `;
        }

        // 2. Si es Empleado, filtra los reclamos según la hora de registro (EXTRACT HOUR)
        if (usuario.rol === 'empleado') {
            const turno = usuario.turno ? usuario.turno.toLowerCase().trim() : '';

            if (turno === 'madrugada') {
                // Intervalo: 12:00 AM (00:00) a 08:00 AM (08:00)
                return await sql`
                    SELECT r.id, r.codigo_seguimiento, r.nombre_propietario, r.dni, r.tipo_impuesto, r.motivo, r.estado, r.fecha_registro, u.nombre as registrado_por
                    FROM reclamos_tributarios r
                    LEFT JOIN usuarios u ON r.usuario_id = u.id
                    WHERE EXTRACT(HOUR FROM r.fecha_registro) >= 0 
                      AND EXTRACT(HOUR FROM r.fecha_registro) < 8
                    ORDER BY r.fecha_registro DESC
                `;
            } else if (turno === 'manana') {
                // Intervalo: 08:00 AM (08:00) a 04:00 PM (16:00)
                return await sql`
                    SELECT r.id, r.codigo_seguimiento, r.nombre_propietario, r.dni, r.tipo_impuesto, r.motivo, r.estado, r.fecha_registro, u.nombre as registrado_por
                    FROM reclamos_tributarios r
                    LEFT JOIN usuarios u ON r.usuario_id = u.id
                    WHERE EXTRACT(HOUR FROM r.fecha_registro) >= 8 
                      AND EXTRACT(HOUR FROM r.fecha_registro) < 16
                    ORDER BY r.fecha_registro DESC
                `;
            } else if (turno === 'noche') {
                // Intervalo: 04:00 PM (16:00) a 12:00 AM (24:00)
                return await sql`
                    SELECT r.id, r.codigo_seguimiento, r.nombre_propietario, r.dni, r.tipo_impuesto, r.motivo, r.estado, r.fecha_registro, u.nombre as registrado_por
                    FROM reclamos_tributarios r
                    LEFT JOIN usuarios u ON r.usuario_id = u.id
                    WHERE EXTRACT(HOUR FROM r.fecha_registro) >= 16 
                      AND EXTRACT(HOUR FROM r.fecha_registro) < 24
                    ORDER BY r.fecha_registro DESC
                `;
            }
        }

        return [];
    } catch (error) {
        console.error('Error al consultar reclamos en el panel:', error);
        return [];
    }
}

// Actualizar cualquier registro e incluir cambio de estado
export async function actualizarEstadoReclamo(idReclamo, nuevoEstado, nuevoMotivo) {
    try {
        await sql`
            UPDATE reclamos_tributarios
            SET estado = ${nuevoEstado}, motivo = ${nuevoMotivo}
            WHERE id = ${idReclamo}
        `;
        return { ok: true };
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        return { ok: false, error: error.message };
    }
}

// Eliminar cualquier registro
export async function eliminarReclamo(idReclamo) {
    try {
        await sql`DELETE FROM reclamos_tributarios WHERE id = ${idReclamo}`;
        return { ok: true };
    } catch (error) {
        console.error('Error al eliminar reclamo:', error);
        return { ok: false, error: error.message };
    }
}