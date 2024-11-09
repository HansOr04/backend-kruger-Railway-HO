import mongoose from "mongoose";
export const connectDB = async () =>{
    try {
        await mongoose.connect(
            "mongodb+srv://hansortiz:admin@krugerback.nuobj.mongodb.net/productoss?retryWrites=true&w=majority&appName=Krugerback");
        console.log("Conectado a la base de datos")
        
    } catch (error) {
        console.error("Error al conectar la base de datos", error)
    }
};
