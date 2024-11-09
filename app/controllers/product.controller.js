import { Product } from "../models/product.model.js"
import logger from "../utils/logger.js";
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);

    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: error.message });

    }
};

const saveProduct = async (req, res) => {
    const product = new Product(req.body);
    try {
        await product.save();
        res.status(201).json(product);

    } catch (error) {
        res.status(400).json({ message: error.message });

    }

};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);


    } catch (error) {
        res.status(400).json({ message: error.message });

    }

};

const getByIdProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);

    } catch (error) {
        res.status(400).json({ message: error.message });

    }

};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(deletedProduct);

    } catch (error) {
        res.status(500).json({ message: error.message });

    }

};
const findProductsByFilters = async (req, res) => {
    try {
        let queryObject = { ...req.query };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObject[el]);

        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        queryObject = JSON.parse(queryStr);
        let sort = '';
        if (req.query.sort) {
            sort = req.query.sort.split(',').join(' ');
        }
        let selected = "";
        if (req.query.fields) {
            selected = req.query.fields.split(',').join(' ');
        }
        //?skip limit page
        let limit = req.query.limit || 100;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;


        const products = await Product.find(queryObject).select(selected).sort(sort).limit(limit).skip(skip);
        res.status(200).json(products);


    } catch (error) {
        res.status(500).json({ message: error.message });

    }

};
//? Vamos a utilizar el metodo agregate para mongoose
//?Se va a definir los pasos de nuestro pipiline( !es la ejecucion de una secuencia de pasos u operaciones)
//! El primer paso es un match  -> es el paso donde se va a filtrar los documentos
const getProductsStatistics = async (req, res) => {
    try {
        const statistcs = await Product.aggregate(
            [
                {
                    $match: {
                        price: { $gte: 10 }
                    },
                },
                //?Segundo paso es procesar los documentos para resolver un proceso complejo
                //!Vamos a agrupar todos los productos y vamos a hacer lo siguente
                //*1. Vamos a contar cuantos productos hay en total
                //*2. Vamos a calcular el precio promedio de nuestros productos
                //*3. Vamos a obtener el precio minimo
                //*4. Vamos a obtener el precio maximo
                {
                    $group: {
                        //?Para poder definir cual es la condicion de agrupamiento, usamos el atributo _id
                        //!Vamos a agrupar todos los procesos
                      //  _id: null,
                      //? Vamos a agrupar por categoria
                        _id: "$category",
                        count: { $sum: 1 },
                        avgPrice: { $avg: "$price" },
                        minPrice: { $min: "$price" },
                        maxPrice: { $max: "$price" },
                    },
                },
                //?El tercer paso es hacer un ordenamientos 
                {
                    $sort: {
                        avgPrice: 1
                    }
                }
            ]
        );

        res.json(statistcs)
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
};


export { getAllProducts, saveProduct, updateProduct, getByIdProducts, deleteProduct, findProductsByFilters, getProductsStatistics }