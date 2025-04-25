import {Router} from "express"
import { loginUser, registerUser } from "../controllers/user.controller.js"

const router = Router()

// routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

export default router