Live URL(https://finanzas-sgia.onrender.com)
userTest= admin
password=Admin02@

# 💰 Sistema de Gestión de Finanzas Personales

¡Bienvenido! Este es un proyecto **Full Stack** que desarrollé para ofrecer una herramienta sencilla, segura y eficiente para el control de gastos e ingresos. Mi enfoque principal fue construir una arquitectura sólida y un sistema de seguridad confiable para la protección de los datos.

## 🚀 Características del Proyecto

* **Autenticación Segura:** Sistema de registro e inicio de sesión con encriptación de contraseñas mediante **Bcrypt**, asegurando que la información sensible nunca se guarde como texto plano.
* **Recuperación de Cuenta:** Flujo completo de "Olvidé mi contraseña" que genera códigos de verificación únicos y los envía al correo del usuario a través de **Nodemailer**.
* **Gestión de Datos en la Nube:** Conexión persistente a una base de datos **MongoDB Atlas**, permitiendo que los registros financieros estén disponibles y seguros en todo momento.
* **Diseño a Medida:** Interfaz construida desde cero con **HTML5 y CSS3**, sin usar frameworks como Bootstrap, logrando un control total sobre la estética y el comportamiento del sitio.
* **Experiencia Dinámica:** Uso de **JavaScript (Vanilla)** para manejar la interactividad del frontend y **SweetAlert2** para notificaciones elegantes.

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Backend** | Node.js & Express.js |
| **Base de Datos** | MongoDB & Mongoose |
| **Frontend** | HTML5, CSS3 & JavaScript |
| **Seguridad** | Bcrypt & Dotenv |
| **Comunicación** | Nodemailer (Gmail API) |

## 📁 Estructura del Proyecto (MVC)

El proyecto sigue el patrón **Modelo-Vista-Controlador** para mantener un código limpio y escalable:

* `models/`: Definición de los esquemas de datos (Usuarios).
* `controllers/`: Lógica de negocio (Autenticación).
* `routes/`: Definición de los puntos de entrada (endpoints) de la API.
* `pages/` & `public/`: Archivos del frontend (HTML, CSS, JS).

   
