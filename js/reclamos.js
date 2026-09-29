import { sql } from './neon-config.js';
import { verificarSesion } from './auth.js';

const usuario = verificarSesion();

// RF-33.3: Registrar Reclamo
export async function registrarReclamo(nombre_propietario, dni, tipo_impuesto, motivo) {
    if (!usuario) return;

    const codigo_seguimiento = 'REC-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    try {
        await sql`
            INSERT INTO reclamos_tributarios (
                codigo_seguimiento, nombre_propietario, dni, tipo_impuesto, motivo, estado, fecha_registro, usuario_id
            ) VALUES (
                ${codigo_seguimiento}, ${nombre_propietario}, ${dni}, ${tipo_impuesto}, ${motivo}, 'registrado', NOW(), ${usuario.id}
            )
        `;
        return { ok: true, codigo: codigo_seguimiento };
    } catch (error) {
        console.error('Error al registrar reclamo:', error);
        return { ok: false, error: error.message };
    }
}

// RF-33.5: Consulta de registros propios del propietario
export async function obtenerMisReclamos() {
    if (!usuario) return [];

    try {
        const reclamos = await sql`
            SELECT id, codigo_seguimiento, nombre_propietario, dni, tipo_impuesto, motivo, estado, fecha_registro
            FROM reclamos_tributarios
            WHERE usuario_id = ${usuario.id}
            ORDER BY fecha_registro DESC
        `;
        return reclamos;
    } catch (error) {
        console.error('Error al obtener reclamos:', error);
        return [];
    }
}

// RF-33.6: Actualización de registro propio
export async function actualizarMiReclamo(idReclamo, tipo_impuesto, motivo) {
    try {
        const resultado = await sql`
            UPDATE reclamos_tributarios 
            SET tipo_impuesto = ${tipo_impuesto}, motivo = ${motivo}
            WHERE id = ${idReclamo} AND usuario_id = ${usuario.id} AND estado = 'registrado'
            RETURNING id
        `;
        
        if (resultado.length === 0) {
            return { ok: false, error: 'No se puede editar: el reclamo ya fue atendido o no existe.' };
        }
        return { ok: true };
    } catch (error) {
        console.error('Error al actualizar reclamo:', error);
        return { ok: false, error: error.message };
    }
}