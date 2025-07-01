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