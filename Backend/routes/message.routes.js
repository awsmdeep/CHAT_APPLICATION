import express from "express"
import {getAllUsers,getMessages,sendMessage} from "../controllers/message.controller.js"
import {isAuthenticated} from "../middleware/auth.middleware.js"

const router=express.Router();

router.get("/get-user",isAuthenticated, getAllUsers);
router.get("/:id",isAuthenticated, getMessages);
router.post("/send/:id",isAuthenticated, sendMessage);

export default router;