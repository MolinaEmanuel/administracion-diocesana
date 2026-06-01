import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Redirect to login if not authenticated
export function requireAuth(callback) {
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = 'index.html';
    } else {
      renderSidebar(user);
      if (callback) callback(user);
    }
  });
}

// Render sidebar with active link highlighting
function renderSidebar(user) {
  const page = window.location.pathname.split('/').pop();
  const initials = user.email.substring(0, 2).toUpperCase();

  const nav = [
    { href: 'dashboard.html',   icon: 'ti-layout-dashboard', label: 'Inicio' },
    { href: 'miembros.html',    icon: 'ti-users',            label: 'Miembros' },
    { href: 'pagos.html',       icon: 'ti-receipt',          label: 'Pagos' },
    { href: 'comprobante.html', icon: 'ti-file-text',        label: 'Comprobantes' },
  ];

  const config = [
    { href: 'parroquias.html',  icon: 'ti-building',         label: 'Lumisiales' },
    { href: 'firmantes.html',   icon: 'ti-signature',        label: 'Firmantes' },
    { href: 'usuarios.html',    icon: 'ti-user-shield',      label: 'Usuarios' },
    { href: 'ajustes.html',     icon: 'ti-settings',         label: 'Ajustes' },
  ];

  const makeItems = arr => arr.map(item => `
    <a href="${item.href}" class="nav-item ${page === item.href ? 'active' : ''}">
      <i class="ti ${item.icon}"></i>${item.label}
    </a>`).join('');

  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-logo">
      <img src="assets/images/logo-gnosis.png" alt="Logo" style="width:60px;height:60px;object-fit:contain;margin-bottom:10px;display:block"/>
      <h2>Administración Diocesana TDF y Sur Santa Cruz</h2>
      <p>Panel de administración</p>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Principal</div>
      ${makeItems(nav)}
      <div class="nav-section-label">Configuración</div>
      ${makeItems(config)}
    </nav>
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">${initials}</div>
        <div class="user-details">
          <div class="user-name">${user.email}</div>
          <div class="user-role">Usuario activo</div>
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
