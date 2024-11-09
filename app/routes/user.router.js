import express from "express";
import { addNewUser,getAllUsers,sendWelcomeEmail,deleteUser} from "../controllers/user.controller.js"

const router = express.Router();
router.post('/',addNewUser);
router.get('/', getAllUsers);
router.post('/send_email',sendWelcomeEmail);
router.delete("/:id",deleteUser);

export default router;
