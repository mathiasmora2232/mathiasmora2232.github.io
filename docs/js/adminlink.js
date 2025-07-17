// js/adminlink.js
// Muestra el enlace de admin si el usuario es admin (usando localStorage)
document.addEventListener('DOMContentLoaded', function() {
  var adminLink = document.getElementById('admin-link');
  if (localStorage.getItem('rol') === 'admin') {
    if(adminLink) adminLink.style.display = 'inline-block';
  } else {
    if(adminLink) adminLink.style.display = 'none';
  }
});
