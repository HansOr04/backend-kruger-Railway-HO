import configs from "../configs/configs.js";
import { User } from "../models/user.model.js"
import jsonWebToken from 'jsonwebtoken';
import sendEmail from "../utils/email.js";
import crypto from "crypto";

const register = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        //?1. vamos a obtener las credenciales(username,password) del request
        //?2.Vamos a buscar el usuario en la base de datos y si no existe retornamos un 404
        //?3. Si el usuario existe vamos a verificar la contrasena
        //?4. Si la contrasena es incorrecta retornamos un 401
        //?5. Si la contrasena es correcta generamos un token JWT utilizando jsonwebtoken
        const { username, password } = req.body;
        const user = await User.findOne({ username:username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordMatch=await user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        //!El metodo sing es firmar nuestro jwt, la firma sirve para poder validar que el token no haya sido modificado por un tercero
        const token = jsonWebToken.sign({ _id: user._id, role: user.role},configs.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body;
        //!1. Vamos a validar si el correo que esta enviando existe o esta almacenado en la BDD
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        //!2. Vamos a generar un token de reseteo de password
        const resetToken=user.getResetPasswordToken();
        await user.save({validateBeforeSave:false});
        //!3. Enviamos el correo con el token de reseteo(URL)
        //?http://localhost:8080/resetpass/resertokenpass
        const resetUrl=`http://localhost:5173/reset-password/${resetToken}`;
        const message=`You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
        try {
            await sendEmail({email:user.email,subject:"Password reset token",message});
            res.status(200).json({message:"Email sent"});
        } catch (error) {
            user.resetPasswordToken=undefined;
            user.resetPasswordExpire=undefined;
            await user.save({validateBeforeSave:false});
            res.status(500).json({message:error.message});
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });        
    }
}
const resetPassword=async(req,res)=>{
    try {
        //?1. Vamos a obtener el token del request
        //?2. Vamos a obtener la nueva paswrod que ha configurado el password
        const {token}=req.params;
        const {password}=req.body;
        //?3. EN BDD tenemos el token pero esta hasheado y lo que llega en el request esta en texto plano
        //*Vamos a hasear el token que llega en el request para poder compararlo con el token hasheado que tenemos en eel DBB
        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
        //?4. Vamos a buscar el usuario en la base de datos de acuerdo al token hasheado y si no existe retornamos un 404
        const user=await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}})
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        //?5. Vamos a actualizar el password del usuario
        user.password=password;
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save();
        //?6. Retornamos un 200
        res.status(200).json({message:"Password reset successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { register, login,forgotPassword,resetPassword};
