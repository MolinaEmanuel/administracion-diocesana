# Administración Diocesana

Sistema web para la administración de diezmos, donaciones y miembros de la diócesis.

---

## Estructura del proyecto

```
diocesis-admin/
├── index.html          ← Login
├── dashboard.html      ← Panel principal con métricas
├── miembros.html       ← ABM de miembros/feligreses
├── pagos.html          ← Registro de diezmos y donaciones
├── comprobante.html    ← Vista, impresión y descarga de comprobantes
├── parroquias.html     ← Gestión de lumisiales/ciudades
├── firmantes.html      ← Hasta 3 firmantes para los comprobantes
├── usuarios.html       ← Gestión de usuarios del sistema
├── ajustes.html        ← Configuración general de la diócesis
├── css/
│   └── styles.css
├── js/
│   ├── firebase-config.js   ← Credenciales Firebase
│   └── auth.js              ← Guard de autenticación y sidebar
└── assets/
    └── logo.png             ← (opcional) logo de la diócesis
```

---

## Configuración inicial en Firebase

### 1. Firestore — colecciones necesarias

Crear las siguientes colecciones en Firestore (se crean automáticamente al cargar el primer documento):

| Colección   | Descripción                          |
|-------------|--------------------------------------|
| `miembros`  | Feligreses de la diócesis            |
| `pagos`     | Diezmos y donaciones                 |
| `parroquias`| Ciudades/lumisiales                  |
| `firmantes` | Hasta 3 firmantes del comprobante    |
| `usuarios`  | Registro de usuarios del sistema     |
| `config`    | Configuración (doc ID: `diocesis`)   |

### 2. Reglas de Firestore

En Firebase Console → Firestore → Reglas, pegá esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Esto permite acceso solo a usuarios autenticados.

### 3. Crear el primer usuario

En Firebase Console → Authentication → Users → Agregar usuario:
- Ingresá el correo y contraseña del primer administrador
- Luego ese usuario puede registrar los demás desde `usuarios.html`

---

## Deploy en Firebase Hosting

### Primera vez

1. Instalá Firebase CLI (requiere Node.js):
   ```
   npm install -g firebase-tools
   ```

2. Iniciá sesión:
   ```
   firebase login
   ```

3. Desde la carpeta del proyecto:
   ```
   firebase init hosting
   ```
   - Seleccioná tu proyecto `administracion-diocesana`
   - Public directory: `.` (punto, la carpeta raíz)
   - Single-page app: **No**
   - Sobrescribir index.html: **No**

4. Publicá:
   ```
   firebase deploy
   ```

### Actualizaciones posteriores

Cada vez que modifiques archivos:
```
firebase deploy
```

---

## Uso del sistema

### Primer acceso
1. Entrá a la URL de Firebase Hosting
2. Iniciá sesión con el usuario creado en Firebase Auth
3. Ir a **Ajustes** y completar los datos de la diócesis
4. Ir a **Lumisiales** y cargar las ciudades
5. Ir a **Firmantes** y asignar los 3 firmantes del comprobante
6. Empezar a cargar **Miembros** y registrar **Pagos**

### Flujo de trabajo típico
1. Miembro se acerca a pagar → `Diezmos` → `Registrar pago`
2. Seleccionás el miembro, ingresás monto y fecha
3. Guardás → aparece en la tabla con botón de comprobante
4. Clic en el ícono de comprobante → se abre la vista
5. Descargás PDF o imprimís directamente

---

## Notas técnicas

- No requiere servidor ni Node.js para funcionar (solo para el deploy)
- Usa Firebase SDK v10 cargado desde CDN
- Módulos ES6 (`type="module"`) — requiere servidor HTTP para desarrollo local
- Para desarrollo local sin instalar nada: abrí los archivos con la extensión **Live Server** de VSCode
