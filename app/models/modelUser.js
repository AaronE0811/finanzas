import mongoose from "mongoose";

const modelUserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un correo electrónico válido.']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    codigoVerificacion: {
        type: String  
    }
});

const User = mongoose.model("User", modelUserSchema);
export default User;