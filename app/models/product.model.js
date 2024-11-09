//? 1. Tenemos que definir el schema del producto (definiciones de los atributos del documento, los tipos de datos y validaciones);
//? 2. Crear el modelo de datos (clase o entidad);
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: [true, "A product must have a title"], unique: true, },
    price: { type: Number,min:[0,"A product must hace a positive price"],max:[10000,"A product must have a price less than 10000"], required: [true, "A product must have a price"] },
    description: { type: String, minlength:[5,"The description must have at 5 characters"],maxlength:[100,"The description must have at 5 characters"], required: [true, "A product must have a description"] },
    image: { type: String, required: [true, "A product must have a image"] },
    category: { type: Array, required: [true, "A product must have a category"] },
    stock: { type: Number,min:[0,"A product must hace a positive stock"], required: [true, "A product must have a stock"] },
});

export const Product = mongoose.model("products", productSchema);