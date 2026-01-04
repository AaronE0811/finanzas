import express from 'express';
const router = express.Router();
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../models/modelUser.js';
import bcrypt from 'bcrypt';
dotenv.config();




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email_user,
        pass: process.env.email_pass,
    },
});

async function guardarCodigoVerificacion(email, codigo) {
  const expiracion = new Date(Date.now()+2*60*1000); // 2 minutos desde ahora
  return await User.findOneAndUpdate(
    { email: email },
    { codigoVerificacion: codigo, codigoExpiracion: expiracion },
    { new: true }
  )
}

router.post('/enviarCodigoCambioClave', async (req, res) => {
    const { email } = req.body;

    

    // Generar un código de verificación aleatorio de 6 dígitos
    const codigoVerificacion = Math.floor(100000 + Math.random() * 900000).toString();

    //verificar si el correo existe en la base de datos
    const usuario = await User.findOne({ email: email });
    if(!usuario){
        return  res.status(404).json({ message: 'El correo electrónico no está registrado.' });
    }

    

    const mailOptions = {
        from: process.env.email_user,
        to: email,
        subject: 'Código de Verificación para Cambio de Clave',
        text: `Tu código de verificación es: ${codigoVerificacion}`,
    };

    try{
        await transporter.sendMail(mailOptions);
        // guardar el código de verificación en la base de datos asociado al usuario
        await guardarCodigoVerificacion(email, codigoVerificacion);
        res.status(200).json({ message: 'Código de verificación enviado exitosamente.', codigo: codigoVerificacion });

        
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el código de verificación.' });
    }
});
router.post('/verificarCodigoCambioClave', async (req, res) => {
    const { email, codigo } = req.body;

    try{
        const usuario = await User.findOne({ email: email });
        if(!usuario){
            return res.status(404).json({ message: 'El correo electrónico no está registrado.' });
        }
        if(usuario.codigoVerificacion !== codigo){
            return res.status(400).json({ message: 'Código de verificación incorrecto.' });
        }
        res.status(200).json({ message: 'Código de verificación correcto.' });

    }catch (error) {
        console.error('Error al verificar el código:', error);
        res.status(500).json({ message: 'Error al verificar el código de verificación.', error: error.message });
    }
});
router.post('/cambiarClave', async (req, res) => {
    const { email, nuevaClave } = req.body;

    try{
        const usuario = await User.findOne({ email: email });
        if(!usuario){
            return res.status(404).json({ message: 'El correo electrónico no está registrado.' });
        }
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&/]).{8,}$/;
    if (!passwordPattern.test(nuevaClave)) {
        return res.status(400).json({ message: 'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo.' });
    }

        //verificar que la nueva no sea igual a la anterior
        const isSamePassword = await bcrypt.compare(nuevaClave, usuario.password);
        if(isSamePassword){
            return res.status(400).json({ message: 'La nueva clave no puede ser igual a la anterior.' });
        }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(nuevaClave, salt);
            usuario.password = hashedPassword;

        await usuario.save();
        res.status(200).json({ message: 'Clave cambiada exitosamente.' });
    }catch (error) {
        console.error('Error al cambiar la clave:', error);
        res.status(500).json({ message: 'Error al cambiar la clave.', error: error.message });
    }
});

export default router;



  