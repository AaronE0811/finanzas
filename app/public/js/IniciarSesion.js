document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    //validar que los campos no esten vacios
    if (username.trim() === '' || password.trim() === '') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor complete todos los campos.'
        });
        return;
    }

    try{
        const res = await fetch('/api/iniciarSesion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (!res.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Error al iniciar sesión.'
            });
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Éxito', 
            text: 'Sesión iniciada exitosamente.'
        })
        .then(() => {
            //guardar el nombre de usuario en el almacenamiento local
            localStorage.setItem('username', username);
            console.log("Username en localStorage:", localStorage.getItem("username"));

            window.location.href = "main.html";
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al iniciar sesión.'
        }); 
    }
});