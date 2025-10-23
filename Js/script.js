


// Lógica de validación del formulario de inicio de sesión

document.addEventListener('DOMContentLoaded', () => {// Asegura que el DOM esté completamente cargado
    const loginForm = document.getElementById('loginForm');// Obtiene el formulario de inicio de sesión
    const errorMessage = document.getElementById('errorMessage');// Obtiene el elemento para mostrar mensajes de error
    const passwordInput = document.getElementById('password');// Obtiene el campo de contraseña
    const showCheckbox = document.getElementById('showPassword');// Obtiene el checkbox para mostrar/ocultar contraseña

    // Credenciales válidas (para demostración)
    const validUsername = 'user123';
    const validPassword = 'pas123';

    // Toggle mostrar/ocultar contraseña
    if (showCheckbox && passwordInput) {// Verifica que los elementos existan
        showCheckbox.addEventListener('change', () => {
            passwordInput.type = showCheckbox.checked ? 'text' : 'password';
        });
    }
    // Verifica que el formulario exista antes de agregar el event listener
    if (!loginForm) return;

    // Evento de envío del formulario (reusa la lógica existente)
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = passwordInput ? passwordInput.value : '';

        if (username === validUsername && password === validPassword) {
            if (errorMessage) {
                errorMessage.style.color = 'green';
                errorMessage.textContent = 'Inicio de sesión exitoso.';
            }
        } else {
            if (errorMessage) {
                errorMessage.style.color = 'red';
                errorMessage.textContent = 'Nombre de usuario o contraseña incorrectos.';
            }
        }

        loginForm.reset();
        // Asegura que la contraseña quede oculta tras enviar
        if (showCheckbox && passwordInput) {
            showCheckbox.checked = false;
            passwordInput.type = 'password';
        }
    });
});
