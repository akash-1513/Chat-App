import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser';
import userRouter from "./routes/user.route.js"
import chatRouter from "./routes/chat.route.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser())

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter)

export {app}