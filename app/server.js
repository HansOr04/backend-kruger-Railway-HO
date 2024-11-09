import express from 'express';
import { connectDB } from './db/db.js';
import productRouter from './routes/product.router.js';
import userRoutes from './routes/user.router.js'
import authRoute from './routes/auth.router.js'
import configs from './configs/configs.js';
import logsRoutes from './routes/logs.router.js'
import orderRoutes from './routes/order.router.js'
import cors from 'cors'
const app = express();
//! Middlewar para parsear el JSON
app.use(express.json());
app.use(cors());

connectDB();
app.use("/products", productRouter);
app.use('/users',userRoutes);
app.use("/auth",authRoute);
app.use("/logs",logsRoutes);
app.use('/order',orderRoutes)

app.listen(configs.PORT, () => {
    console.log(`Server running on port ${configs.PORT}`);
});