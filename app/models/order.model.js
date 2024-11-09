import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    totalPrice:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
       default: Date.now,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: [true, "An order must have a user"] },
    comment:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comments",
        }
    ],
    products:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                min:[1,"A product must have  a positive quantity"],
            },
        }
    ]
});

export const Order = mongoose.model("orders", orderSchema);