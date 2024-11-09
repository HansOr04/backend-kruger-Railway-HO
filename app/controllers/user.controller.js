import { User } from '../models/user.model.js'
import sendEmail from '../utils/email.js'
const addNewUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({deletedAt:null});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const sendWelcomeEmail = async (req, res) => {
    //debe permitir enviar email, subject,text
    try {
        const { email, subject, message } = req.body;
        await sendEmail({ email, subject, message });
        res.status(200).json({ message: "Email sent" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { deletedAt: Date.now() },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export {
    addNewUser,
    getAllUsers,
    sendWelcomeEmail,
    deleteUser
}