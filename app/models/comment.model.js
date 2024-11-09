import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    message: { type: String, required: [true, "A comment must have a comment"] },
    createdAt:{
        type:Date,
       default: Date.now, 
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: [true, "A comment must have a user"] },

});
export const Comment = mongoose.model("comments", commentSchema);