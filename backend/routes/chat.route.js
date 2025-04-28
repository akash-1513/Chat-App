import {Router} from 'express' 
import { createOrGetOneToOneChat } from '../controllers/chat.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/create/:recieverId").post(verifyJWT, createOrGetOneToOneChat);

export default router;