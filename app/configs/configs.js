import dotenv from "dotenv";

dotenv.config();

export default {
    PORT: process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET,
    MAILTRAP_USER:process.env.MAILTRAP_USER,
    MAILTRAP_PASS:process.env.MAILTRAP_PASS,
}