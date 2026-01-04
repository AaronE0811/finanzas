import express from 'express';
const router = express.Router();
import { registrarUsuario } from '../controllers/authController.js';


router.post('/crearCuenta', registrarUsuario);

export default router;