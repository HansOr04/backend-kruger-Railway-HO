//? En las options vamos a recibir el email a donde vamos a enviar el correo
//? Vamos a recibir el asunto del correo
//? Vamos a recibir el contenido del correo
import nodemailer from "nodemailer";
import configs from "../configs/configs.js";

const sendEmail = async(options)=>{
    //! Vamos a crear la integracion de mailtrap usando el nodemailer
    const transporter = nodemailer.createTransport({
        host: "live.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: configs.MAILTRAP_USER,
            pass: configs.MAILTRAP_PASS,
        }
    });
    //!Vamos a armar las opciones de envio de nuestro correo
    const mailOptions = {
        from: '"Kruger Backend" <no-reply@demomailtrap.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;