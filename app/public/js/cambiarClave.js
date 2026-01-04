
document.getElementById("form-1").addEventListener("submit", async (e) => {
  e.preventDefault();
  const correo = document.getElementById("correo").value.trim();

  const emailPattern = /^\S+@\S+\.\S+$/;
  if (!emailPattern.test(correo)) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Por favor ingrese un correo electrónico válido.' });
    return;
  }

  try {
    const res = await fetch("/api/enviarCodigoCambioClave", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email: correo }),
    });

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Código de verificación enviado exitosamente.'
      }).then(() => {
        document.getElementById("inputs").style.display = "block";
        const codeInputs = document.querySelectorAll(".code-input");
        codeInputs.forEach(input => input.removeAttribute("disabled"));
        document.getElementById("btnVerificar").removeAttribute("disabled");
        

        //boton
        document.getElementById("btnEnviar").setAttribute("disabled", "true");
        document.getElementById("btnEnviar").setAttribute("title", "Verifica el código recibido en tu correo o espera 60 segundos para reenviar");
        document.getElementById("btnEnviar").style.color = "gray";
        document.getElementById("btnEnviar").style.cursor = "not-allowed";
        setTimeout(() => {
            document.getElementById("btnEnviar").removeAttribute("disabled");
            document.getElementById("btnEnviar").removeAttribute("title");
            document.getElementById("btnEnviar").style.color = "";
            document.getElementById("btnEnviar").style.cursor = "pointer";
        }, 60000); //60 segundos


      });
    } else {
      const data = await res.json();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message || 'Error al enviar el código de verificación.'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al enviar el código de verificación.'
    });
  }
});
document.getElementById("btnVerificar").addEventListener("click", async () => {
    const inputs = document.querySelectorAll(".code-input");
    const correo = document.getElementById("correo").value.trim();
    //unir codigo
    let codigo = "";
    inputs.forEach((input) => {
        codigo += input.value;
    });
    if (codigo.length !== 6) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Por favor ingrese el código de verificación completo.' });
        return;
    }

    try{
        const res = await fetch("/api/verificarCodigoCambioClave", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ email: correo, codigo: codigo }),
        });
        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Código de verificación correcto.'
            }).then(() => {
                const nuevaClaveInput = document.getElementById("nuevaClave");
                const confirmarClaveInput = document.getElementById("confirmarClave");
                const btnCambiar = document.getElementById("btnCambiar");
                nuevaClaveInput.removeAttribute("disabled");
                confirmarClaveInput.removeAttribute("disabled");
                btnCambiar.removeAttribute("disabled");

                document.getElementById("btnVerificar").setAttribute("disabled", "true");
                document.getElementById("btnVerificar").setAttribute("title", "Código ya verificado");
                document.getElementById("btnVerificar").style.color = "gray";
                document.getElementById("btnVerificar").style.cursor = "not-allowed";
                setTimeout(() => {
                    document.getElementById("btnVerificar").removeAttribute("disabled");
                    document.getElementById("btnVerificar").removeAttribute("title");
                    document.getElementById("btnVerificar").style.color = "";
                    document.getElementById("btnVerificar").style.cursor = "pointer";
                }, 60000); //60 segundos
            });
        } else {
            const data = await res.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.message || 'Código de verificación incorrecto.'
            });
        }
    }catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al verificar el código de verificación.'
        });
    }


});
document.getElementById("btnCambiar").addEventListener("click", async () => {
    const nuevaClave = document.getElementById("nuevaClave").value.trim();
    const confirmarClave = document.getElementById("confirmarClave").value.trim();
    const correo = document.getElementById("correo").value.trim();

    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    async function User(password) {
    if (!passwordPattern.test(password)) {
            alert("La contraseña debe tener mayúscula, minúscula, número, carácter especial y mínimo 8 caracteres.");
            return;
        }
    };

    if (nuevaClave !== confirmarClave) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden.' });
        return;
    }

    try {
        const res = await fetch("/api/cambiarClave", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ email: correo, nuevaClave: nuevaClave }),
        });
    
        if (res.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Clave cambiada exitosamente.'
        }).then(() => {
            window.location.href = "IniciarSesion.html";
        }); 
    } else {
        const data = await res.json();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message || 'Error al cambiar la clave.'
        });
    }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cambiar la clave.'
        });
    }
    
});
