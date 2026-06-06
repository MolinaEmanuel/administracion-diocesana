import { db, auth } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/**
 * Registra una acción en el historial de auditoría.
 * @param {string} tipo     - 'miembro' | 'pago' | 'comprobante'
 * @param {string} accion   - 'alta' | 'edicion' | 'baja' | 'emision'
 * @param {string} detalle  - Descripción legible de lo que se hizo
 * @param {object} extra    - Datos adicionales opcionales (id del doc, nombre, etc.)
 */
export async function registrarHistorial(tipo, accion, detalle, extra = {}) {
  try {
    const user = auth.currentUser;
    await addDoc(collection(db, 'historial'), {
      tipo,
      accion,
      detalle,
      usuario:    user?.email || 'desconocido',
      fecha:      serverTimestamp(),
      extra,
    });
  } catch (e) {
    console.warn('No se pudo registrar en historial:', e);
  }
}
