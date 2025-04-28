import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true 
    },
    avatar: {
        type: String,
        default: "https://thaka.bing.com/th/id/OIP.cPCS5csoH8WNpSUOIfJSqQHaHa?w=195&h=199&c=7&r=0&o=5&dpr=1.5&pid=1.7"
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true})

userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next()
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        fullname: this.fullname,
        email: this.email,
        _id: this._id
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        fullname: this.fullname,
        email: this.email,
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
}


export const User = mongoose.model("User", userSchema);