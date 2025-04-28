import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadImage } from "../utils/uploadImage.js";

const generateAccessRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken};
}

const registerUser = asyncHandler(async (req, res) => {
    const {fullname, email, password} = req.body;
    if(!fullname || !email || !password) {
        return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
    }

    const userAlreadyExists = await User.findOne({email});

    if(userAlreadyExists) {
        return res.status(409).json(new ApiResponse(409, null, "User already exists with same email id"));
    }

    const avatarLocalFilePath = req.file?.path;
    if(!avatarLocalFilePath) {
        return res.status(400).json(new ApiResponse(400, null, "file upload failed"));
    }

    const uploadResult = await uploadImage(avatarLocalFilePath);
    if(!uploadResult) {
        return res.status(500).json(new ApiResponse(500, null, "Error uploading on cloudinary service"));
    } 

    const user = await User.create({
        fullname,
        email,
        password,
        avatar: uploadResult?.url
    });

    return res.status(201).json(new ApiResponse(201, {fullname: user.fullname, email: user.email, avatar: user.avatar}, "User created successfully"));
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json(new ApiResponse(400, null, "All fields are required"));
    }

    const user = await User.findOne({email});

    if(!user) {
        return res.status(401).json(new ApiResponse(401, null, "Invalid email or password"));
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if(!isPasswordCorrect) return res.status(401).json(new ApiResponse(401, null, "Invalid password"));

    const {accessToken, refreshToken} = await generateAccessRefreshToken(user?._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {accessToken, refreshToken}, "Logged In successful"));
})

// /api/v1/user/all?search=akash
const fetchAllUsers = asyncHandler(async (req, res) => {
    const keyword = req.query?.search;
    const users = await User.find({
        $and: [
            {_id: {$ne: req.user?._id}},
            {$or: [{name: {$regex: keyword, $options: "i"}}, {email: {$regex: keyword, $options: "i"}}]}
        ]
    })

    return res.status(200).json(
        new ApiResponse(200, users, "all user fetched successfully")
    )
})

export {registerUser, loginUser, fetchAllUsers}