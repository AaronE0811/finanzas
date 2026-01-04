import mongoose from "mongoose";

const modeloGraficaSchema = mongoose.Schema({
    monto:{
        type:Number,
        required:true,
        validate:{
            validator:function(v){
                return v >= 0;
            },
            message:props => `${props.value} no es un monto válido. Debe ser un número positivo.`
        }
    },
    categoria: {
    type: String,
    maxlength: 50,
    default: "",
    validate: {
        validator: function (v) {
            if (this.tipo === "Ingreso") return true; // permite vacío para Ingreso
            return v && v.length >= 3; // mínimo 3 caracteres para Gasto
        },
        message: "La categoría debe tener al menos 3 caracteres para los gastos."
    }
},



    
    tipo:{
        type:String,
        required:true,
        enum:["Ingreso","Gasto"]
    },
    mes:{
        type:String,
        required:true,
        enum:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
    },
    username:{
        type:String,
        required:true
    }
});
modeloGraficaSchema.index({ mes: 1, categoria: 1 },
  { unique: true, partialFilterExpression: { tipo: "Gasto" } });
const ModeloGrafica = mongoose.model("ModeloGrafica", modeloGraficaSchema);

export default ModeloGrafica;