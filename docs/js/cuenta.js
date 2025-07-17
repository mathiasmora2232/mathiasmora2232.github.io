// Mostrar el enlace de admin si el usuario es admin
function setAdminLink() {
  const adminLink = document.getElementById('admin-link');
  if (localStorage.getItem('rol') === 'admin') {
    adminLink.style.display = 'inline-block';
  } else {
    adminLink.style.display = 'none';
  }
}

// Mostrar el usuario actual
function setUsername() {
  const username = localStorage.getItem('usuario') || '(no definido)';
  const email = localStorage.getItem('email') || '';
  let texto = username;
  if(email) texto += ' (' + email + ')';
  document.getElementById('username-display').textContent = texto;
}

// Cargar o mostrar datos personales
function loadUserData(editable = false) {
  const username = localStorage.getItem('usuario') || '';
  const email = localStorage.getItem('email') || '';
  const key = 'datosUsuario_' + username + '_' + email;
  const datos = JSON.parse(localStorage.getItem(key) || '{}');
  const fields = [
    'nombre','pasaporte','fecha_nacimiento','sexo','estado_civil','tipo_sangre','provincia_nacimiento','canton','ciudad','correo','correo_institucional'
  ];
  fields.forEach(function(field) {
    const input = document.getElementById(field);
    if(input) {
      input.value = datos[field] || '';
      input.disabled = !editable;
    }
  });
  // Cambiar texto del botón
  document.getElementById('save-btn').textContent = editable ? 'Guardar datos' : 'Cambiar datos';
}

// Inicialización al cargar la página
window.addEventListener('DOMContentLoaded', function() {
  setAdminLink();
  setUsername();
  loadUserData(false);

  // Cerrar sesión
  document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    window.location.href = 'Login.html';
  });

  // Alternar edición/lectura y guardar datos
  let editMode = false;
  document.getElementById('user-data-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if(!editMode) {
      loadUserData(true);
      editMode = true;
      return;
    }
    // Guardar datos
    const username = localStorage.getItem('usuario') || '';
    const email = localStorage.getItem('email') || '';
    const key = 'datosUsuario_' + username + '_' + email;
    const datos = {
      nombre: document.getElementById('nombre').value,
      pasaporte: document.getElementById('pasaporte').value,
      fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
      sexo: document.getElementById('sexo').value,
      estado_civil: document.getElementById('estado_civil').value,
      tipo_sangre: document.getElementById('tipo_sangre').value,
      provincia_nacimiento: document.getElementById('provincia_nacimiento').value,
      canton: document.getElementById('canton').value,
      ciudad: document.getElementById('ciudad').value,
      correo: document.getElementById('correo').value,
      correo_institucional: document.getElementById('correo_institucional').value
    };
    localStorage.setItem(key, JSON.stringify(datos));
    // Guardar en el servidor
    fetch('http://127.0.0.1:5000/guardar_datos_usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, datos })
    })
    .then(res => res.json())
    .then(resp => {
      document.getElementById('save-msg').textContent = resp.success ? '¡Datos guardados en el servidor!' : 'Guardado local, pero error en servidor';
      document.getElementById('save-msg').style.display = 'block';
      setTimeout(()=>{
        document.getElementById('save-msg').style.display = 'none';
        document.getElementById('save-msg').textContent = '¡Datos guardados!';
      }, 2000);
    })
    .catch(()=>{
      document.getElementById('save-msg').textContent = 'Guardado local, pero error en servidor';
      document.getElementById('save-msg').style.display = 'block';
      setTimeout(()=>{
        document.getElementById('save-msg').style.display = 'none';
        document.getElementById('save-msg').textContent = '¡Datos guardados!';
      }, 2000);
    });
    loadUserData(false);
    editMode = false;
  });
});
