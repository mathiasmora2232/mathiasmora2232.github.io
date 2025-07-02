document.querySelector('.form-for-login').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.querySelector('input[name="login[username]"]').value;
    const password = document.querySelector('input[name="login[password]"]').value;

    fetch('usuarios.json')
        .then(response => response.json())
        .then(usuarios => {
            const usuarioValido = usuarios.find(user => user.email === email && user.password === password);
            if (usuarioValido) {
                alert('¡Inicio de sesión exitoso!');
                window.location.href = 'cuenta.html';
            } else {
                alert('Correo o contraseña incorrectos');
            }
        })
        .catch(error => {
            alert('Error al cargar usuarios');
            console.error(error);
        });
});
navSlide();
// Notificaciones panel
const notificationsBtn = document.getElementById('notificationsBtn');
const notificationsPanel = document.getElementById('notificationsPanel');
const closeNotifications = document.getElementById('closeNotifications');
const tabUnread = document.getElementById('tabUnread');
const tabAll = document.getElementById('tabAll');
const unreadList = document.getElementById('unreadList');
const allList = document.getElementById('allList');


notificationsBtn.addEventListener('click', () => {
  // Si ya está visible, ciérralo
  if (notificationsPanel.style.display === 'flex') {
    notificationsPanel.style.display = 'none';
  } else {
    notificationsPanel.style.display = 'flex';
  }
});

closeNotifications.addEventListener('click', () => {
  notificationsPanel.style.display = 'none';
});

tabUnread.addEventListener('click', () => {
  tabUnread.classList.add('active');
  tabAll.classList.remove('active');
  unreadList.style.display = '';
  allList.style.display = 'none';
});

tabAll.addEventListener('click', () => {
  tabAll.classList.add('active');
  tabUnread.classList.remove('active');
  allList.style.display = '';
  unreadList.style.display = 'none';
});