import {Router} from "express"
import { fetchAllUsers, loginUser, registerUser } from "../controllers/user.controller.js"
import { upload } from "../utils/fileUpload.js";

const router = Router()

// routes
router.route("/register").post(upload.single('avatar'), registerUser);
router.route("/login").post(loginUser);
router.route("/all").get(fetchAllUsers);

export default router