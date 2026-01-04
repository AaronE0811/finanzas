document.getElementById("form-1").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;

    // VALIDACIÓN DE USUARIO
    if (username.length < 3 || username.length > 30) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'El nombre de usuario debe tener entre 3 y 30 caracteres.' });
        return;
    }

    // VALIDACIÓN DE CORREO ELECTRÓNICO
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(correo)) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Por favor ingrese un correo electrónico válido.' });
        return;
    }
    // VALIDACIÓN DE CONTRASEÑA
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!pattern.test(password)) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo.' });
        return;
    }

    try{
        const res = await fetch("/api/crearCuenta", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username, email: correo,  password }),
        });

        const data = await res.json();

        if (!res.ok) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Error al crear la cuenta.'
            });
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Cuenta creada exitosamente.'
        })
        .then(() => {
            window.location.href = "IniciarSesion.html"; 
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear la cuenta.'
        });
    }
});