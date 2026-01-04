import bcrypt from 'bcrypt';
import User from '../models/modelUser.js';
import nodemailer from 'nodemailer';

// 1. Configuración de Transporter 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email_user,
        pass: process.env.email_pass,
    },
});


async function guardarCodigoVerificacion(email, codigo) {
    const expiracion = new Date(Date.now() + 2 * 60 * 1000);
    return await User.findOneAndUpdate(
        { email },
        { codigoVerificacion: codigo, codigoExpiracion: expiracion },
        { new: true }
    );
}



// Registro de usuarios
export const registrarUsuario = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: 'El correo o usuario ya existe.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        
        await newUser.save();
        res.status(201).json({ message: 'Cuenta creada con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro.' });
    }
};

// Enviar código para recuperar clave
export const enviarCodigo = async (req, res) => {
    const { email } = req.body;
    try {
        const usuario = await User.findOne({ email });
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado.' });

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        await transporter.sendMail({
            from: process.env.email_user,
            to: email,
            subject: 'Código de recuperación',
            text: `Tu código es: ${codigo}`
        });

        await guardarCodigoVerificacion(email, codigo);
        res.status(200).json({ message: 'Código enviado.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar código.' });
    }
};

// Cambiar la clave final
export const actualizarClave = async (req, res) => {
    const { email, nuevaClave } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nuevaClave, salt);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });
        res.status(200).json({ message: 'Clave actualizada.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar clave.' });
    }
};


export const loginUsuario = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Buscar al usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no existe' });
        }

        // 2. Comparar contraseñas 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

    
        res.status(200).json({ message: 'Sesión iniciada correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};