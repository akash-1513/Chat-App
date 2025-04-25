import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/apiResponse.js";
import {User} from '../models/user.model.js'

const verifyJWT = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.Split(' ')[1];
    
    if(!accessToken) {
        return res.status(401).json(new ApiResponse(401, null, "user not logged in"));
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);
    req.user = user;
    next();
}

export {verifyJWT}