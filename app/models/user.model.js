import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto'
const userSchema = new mongoose.Schema({
    username: { type: String, required: [true, "A user must have a username"], unique: true },
    email: { type: String, required: [true, "A user must have a email"], unique: true },
    password: { type: String, required: [true, "A user must have a password"] },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ["admin", "user","author"],
        default: "user"
    },
    resetPasswordToken:String, //? Para poder generar un identificador unico que vamos a enviar al usuario (correo)
    resetPasswordExpire:Date, //? Para poder definir la fecha de expiracion de nuestro token
    deletedAt:{
        type:Date,
        default:null,
        
    }
});
userSchema.pre("save", async function (next) {
    const user = this;
    //!Solamente si se esta modificando el atributo password vamos a proceder a hashear la password
    if (user.isModified("password")) {
        try {
            //? Primer paso para hashear la password es generar un salt
            const salt = await bcrypt.genSalt(10);
            //? Segundo paso es hashear la password
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});
//? Vamos a crear un hook que se encargue de eliminar la password del objeto que se va a devolver al cliente
userSchema.post("find",function(docs,next){
    docs.forEach((doc)=>{
        doc.password=undefined;
    });
    next();
});
//?Vamos a extender la funcionalidad de nuestro schema, de manera que tenga un metodo que nos permita comparar la password que el usuario esta enviado con la password en la db
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
//? vamos a agregar un metodo a nuestro schema que nos permita generar un token de reseteo de password
userSchema.methods.getResetPasswordToken = function () {
    //? Generamos la cadena randomica en formato hexadecimal
    const resetToken = crypto.randomBytes(20).toString("hex");
    //? Guardamos el token en el objeto del usuario
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    //? Configuramos la fecha de expiracion del token
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}
export const User = mongoose.model('users', userSchema);