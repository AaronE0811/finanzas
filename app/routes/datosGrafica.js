import express from 'express';
import ModeloGrafica from '../models/ModeloGrafica.js';
const router = express.Router();

//ruta para guardar los datos del formulario

router.post('/ingresarDatos', async (req, res) => {
    try {

        const { monto, categoria, tipo, mes, username } = req.body;

    
        const nuevoDato = new ModeloGrafica({
            monto,
            categoria,
            tipo,
            mes,
            username
        });
        if (tipo === "Gasto" && (!categoria || categoria.trim().length < 3)) {
        return res.status(400).json({ message: "La categoría debe tener al menos 3 caracteres para los gastos." });
        }

        await nuevoDato.save();
        res.status(201).json({ message: "Datos guardados correctamente", datos: nuevoDato });
    } catch (error) {
        console.log("ERROR BACKEND:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Ya existe un registro para esta categoría en el mes seleccionado." });
        }
        res.status(500).json({ message: "Error al guardar los datos", error });
    }
});
router.get('/obtenerDatos', async (req, res) => {
  try {

    const { mes, username } = req.query;
    if (!mes || !username) return res.status(400).json({ message: "El parámetro 'mes' y 'username' son obligatorios." });

    const datos = await ModeloGrafica.find({ mes, username });
    res.status(200).json(datos);
  } catch (error) {
    console.log("ERROR AL OBTENER DATOS:", error);
    res.status(500).json({ message: "Error al obtener los datos", error });
  }
});
router.delete('/eliminarDato', async (req, res) => {
    try {
        const { id, username } = req.body;
        const eliminado = await ModeloGrafica.findOneAndDelete({ _id: id, username });
        if (!eliminado) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }  
          res.status(200).json({ message: "Dato eliminado correctamente" });
    } catch (error) {
        console.log("ERROR AL ELIMINAR DATO:", error);
        res.status(500).json({ message: "Error al eliminar el dato", error });
    }
});
router.get('/obtenerDatosAnuales', async (req, res) => {
    try {
        const {username} = req.query;
        if (!username) return res.status(400).json({ message: "El parámetro 'username' es obligatorio." });
        const datos = await ModeloGrafica.find({username});

        res.status(200).json(datos);
    }catch (error) {
        console.log("ERROR AL OBTENER DATOS ANUALES:", error);
        res.status(500).json({ message: "Error al obtener los datos anuales", error });
    }
});

export default router;