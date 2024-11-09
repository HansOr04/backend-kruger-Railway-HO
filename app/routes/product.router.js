import express from "express";
import { getAllProducts, saveProduct,updateProduct, getByIdProducts,deleteProduct,findProductsByFilters,getProductsStatistics} from "../controllers/product.controller.js";
const router = express.Router();

router.get('/', getAllProducts);
router.post('/',saveProduct);
router.put('/:id',updateProduct);
router.get('/statistcs',getProductsStatistics);
router.get('/by-filters', findProductsByFilters);

router.get('/:id',getByIdProducts);
router.delete('/:id',deleteProduct);

export default router;