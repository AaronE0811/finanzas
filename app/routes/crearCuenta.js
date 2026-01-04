import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/modelUser.js';

const router = express.Router();

router.post('/crearCuenta', async (req, res) => {
    const { username, email, password } = req.body;


    //verificar que no exista correo o usuario
    const existingUser = await User.findOne({ $or: [ { email }, { username } ] });
    if (existingUser) {
        return res.status(400).json({ message: 'El correo electrónico o nombre de usuario ya está en uso.' });
    }
    // Validaciones básicas
    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ message: 'El nombre de usuario debe tener entre 3 y 30 caracteres.' });
    }
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ message: 'Por favor ingrese un correo electrónico válido.' });
    }
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*/?&]).{8,}$/;
    if (!passwordPattern.test(password)) {
        return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo.' });
    }
    //hash de la contraseña
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'Cuenta creada exitosamente.' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la cuenta.' });
    }
});

export default router;
