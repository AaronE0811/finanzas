import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; 
import conectarDB from './config/mongoDB.js';

// Importación de rutas
import routes from './/routes/datosGrafica.js';
import crearCuenta from './routes/crearCuenta.js';
import iniciarSesion from './routes/iniciarSesion.js';
import cambiarClave from './routes/cambiarClave.js';

// Inicializaciones
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Configuración de la base de datos
conectarDB();

// Middlewares
app.use(express.json());
app.set("port", process.env.PORT || 4001);

// Archivos estáticos

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "pages")));

// Rutas de Páginas (Frontend)
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "pages/main.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "pages/IniciarSesion.html")));
app.get("/reset-password", (req, res) => res.sendFile(path.join(__dirname, "pages/cambiarClave.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "pages/crearCuenta.html")));
// Rutas de API (Backend)
app.use("/api", routes);
app.use("/api", crearCuenta);
app.use("/api", iniciarSesion);
app.use("/api", cambiarClave);

// Manejador de 404 
app.use((req, res) => {
    res.status(404).send('<h1>404 - Página no encontrada</h1>');
});

// Arrancar servidor
app.listen(app.get("port"), () => {
    console.log(`🚀 Servidor listo en: http://localhost:${app.get("port")}`);
});