import express from 'express';
const router = express.Router();


import { enviarCodigo, verificarCodigo, actualizarClave } from '../controllers/authController.js';

router.post('/enviarCodigoCambioClave', enviarCodigo);
router.post('/verificarCodigoCambioClave', verificarCodigo);
router.post('/actualizarClave', actualizarClave);
export default router;