import { Product } from "../models/product.model.js"
import { Order } from "../models/order.model.js"
import {Comment} from '../models/comment.model.js'
import mongoose from "mongoose";
const createOrder = async (req,res) =>{
    try {
        //? Para crear la orden primero necesitamos calcular el total de la orden
        const {products,userId,comments}=req.body;
        //productos = [{id:1, quantity:2},{id:2, quantity:2}]
        let totalPrice=0;
        for (const product of products) {
            const {price}=await Product.findById(product.product);
            totalPrice+=price*product.quantity;
        };
        const order=await Order.create({
            totalPrice,
            user:userId,
            products,
            comments:comments || ''
        });
        res.status(201).json(order);

        
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
};
const getOrdersbyUserId = async(req, res) => {
    try {


        // 3. Buscar las órdenes
        const orders = await Order.find({
            user:req.params.id
        })
        .populate({
            path: 'user',
            select: 'username email role' // Solo los campos que necesitas
        })
        .populate({
            path: 'products.product',
            select: 'name price' // Ajusta según los campos que tenga tu modelo de producto
        })
        .sort({ createdAt: -1 }) // Ordenar por fecha de creación, más recientes primero
        .exec();

        // 4. Verificar si se encontraron órdenes
        if (!orders || orders.length === 0) {
            return res.status(200).json({
                success: true,
                message: "El usuario no tiene órdenes registradas",
                data: []
            });
        }

        // 5. Devolver las órdenes encontradas
        return res.status(200).json({
            success: true,
            message: "Órdenes encontradas exitosamente",
            count: orders.length,
            data: orders
        });

    } catch (error) {
        console.error('Error al buscar órdenes:', error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor al buscar las órdenes",
            error: error.message
        });
    }
};
const addCommentToOrder = async(req,res)=>{
    try {
        const {orderId} = req.params;
        const {userId,message}=req.body;
        const comment = new Comment({
            user:userId,
            message
        });
        await comment.save();
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }
        order.commentconsole.log('Creating order...');
console.log('Request body:', req.body);
console.log('Products:', products);
console.log('Total price:', totalPrice);
console.log('Order created:', order);

console.log('Getting orders by user ID...');
console.log('User ID:', req.params.id);
console.log('Orders found:', orders);

console.log('Adding comment to order...');
console.log('Order ID:', orderId);
console.log('Comment:', comment);
console.log('Order updated:', order);ush(comment._id);
        await order.save();
        res.status(201).json({message: 'Comment added to order'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
export {createOrder,getOrdersbyUserId,addCommentToOrder};