import express from 'express';
const router = express.Router();
import { loginUsuario } from '../controllers/authController.js';

router.post('/iniciarSesion', loginUsuario);

export default router;