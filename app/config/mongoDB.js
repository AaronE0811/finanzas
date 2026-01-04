import mongoose from "mongoose";
import ModeloGrafica from "../models/ModeloGrafica.js";

const conectarDB = async () => {
    try {
        await mongoose.connect(
            process.env.MongoURL
            
        );
        console.log("Conectado a la base de datos MongoDB");

        // Inicializa índices definidos en el schema
        await ModeloGrafica.init();
        console.log("Índices sincronizados correctamente");
    } catch (error) {
        console.error("Error al conectar a la base de datos MongoDB:", error);
        process.exit(1);
    }
};

export default conectarDB;
