import express from 'express';
const router = express.Router();


import { enviarCodigo, verificarCodigo, cambiarClave } from '../controllers/authController.js';

router.post('/enviarCodigoCambioClave', enviarCodigo);
router.post('/verificarCodigoCambioClave', verificarCodigo);
router.post('/cambiarClave', cambiarClave);

export default router;