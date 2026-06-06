import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Roles ─────────────────────────────────────────────────────────────────
// Admin: acceso total
// operador: puede ver miembros, agregar/editar miembros, registrar pagos,
//           emitir comprobantes, ver estadísticas. NO puede tocar configuración.

const ADMIN_EMAILS = ['emanuelmolina.ush@gmail.com', 'luchoman67sj@gmail.com'];

export function isAdmin(email) {
  return ADMIN_EMAILS.includes(email?.toLowerCase());
}

// Páginas restringidas a admin
const ADMIN_ONLY_PAGES = ['parroquias.html','firmantes.html','usuarios.html','ajustes.html'];

// ── Guard principal ────────────────────────────────────────────────────────
export function requireAuth(callback) {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.location.href = 'index.html';
      return;
    }

    // Verificar si la página actual es solo para admin
    const page = window.location.pathname.split('/').pop();
    if (ADMIN_ONLY_PAGES.includes(page) && !isAdmin(user.email)) {
      window.location.href = 'dashboard.html';
      return;
    }

    // Buscar firmante asociado al email del usuario
    const firmante = await getFirmanteByEmail(user.email);

    renderSidebar(user, firmante);
    if (callback) callback(user, firmante);
  });
}

// ── Buscar firmante por email ──────────────────────────────────────────────
export async function getFirmanteByEmail(email) {
  try {
    const snap = await getDocs(
      query(collection(db, 'firmantes'), where('correo', '==', email.toLowerCase()))
    );
    if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() };
  } catch(e) {}
  return null;
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function renderSidebar(user, firmante) {
  const page     = window.location.pathname.split('/').pop();
  const initials = user.email.substring(0, 2).toUpperCase();
  const admin    = isAdmin(user.email);

  // Nombre para mostrar: usar nombre del firmante si existe, sino email
  const displayName = firmante?.nombre || user.email;
  const displayRole = admin ? 'Administrador' : 'Operador';

  const nav = [
    { href: 'dashboard.html',    icon: 'ti-layout-dashboard', label: 'Inicio' },
    { href: 'estadisticas.html', icon: 'ti-chart-bar',        label: 'Estadísticas' },
    { href: 'miembros.html',     icon: 'ti-users',            label: 'Miembros' },
    { href: 'pagos.html',        icon: 'ti-receipt',          label: 'Pagos' },
    { href: 'comprobante.html',  icon: 'ti-file-text',        label: 'Comprobantes' },
  ];

  // Sección configuración solo visible para admin
  const configItems = admin ? `
    <a href="historial.html" class="nav-item ${page === 'historial.html' ? 'active' : ''}">
      <i class="ti ti-history"></i>Historial
    </a>
    <div class="nav-section-label">Configuración</div>
    <a href="parroquias.html" class="nav-item ${page === 'parroquias.html' ? 'active' : ''}">
      <i class="ti ti-building"></i>Lumisiales
    </a>
    <a href="firmantes.html" class="nav-item ${page === 'firmantes.html' ? 'active' : ''}">
      <i class="ti ti-signature"></i>Firmantes
    </a>
    <a href="usuarios.html" class="nav-item ${page === 'usuarios.html' ? 'active' : ''}">
      <i class="ti ti-user-shield"></i>Usuarios
    </a>
    <a href="ajustes.html" class="nav-item ${page === 'ajustes.html' ? 'active' : ''}">
      <i class="ti ti-settings"></i>Ajustes
    </a>` : '';

  const makeItems = arr => arr.map(item => `
    <a href="${item.href}" class="nav-item ${page === item.href ? 'active' : ''}">
      <i class="ti ${item.icon}"></i>${item.label}
    </a>`).join('');

  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-logo">
      <img src="assets/images/logo-gnosis.png" alt="Logo" style="width:80px;height:80px;object-fit:contain;margin-bottom:10px;display:block"/>
      <h2>Administración Diocesana TDF y Sur de Santa Cruz</h2>
      <p>Panel de administración</p>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Principal</div>
      ${makeItems(nav)}
      ${configItems}
    </nav>
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">${initials}</div>
        <div class="user-details">
          <div class="user-name">${displayName}</div>
          <div class="user-role">${displayRole}</div>
        </div>
        <button class="btn btn-icon" id="btnLogout" title="Cerrar sesión" style="margin-left:auto">
          <i class="ti ti-logout" style="font-size:15px"></i>
        </button>
      </div>
    </div>`;

  document.getElementById('btnLogout').addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'index.html';
  });
}
