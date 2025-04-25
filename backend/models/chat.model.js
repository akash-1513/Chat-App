import mongoose, { mongo } from "mongoose"

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Chat name is required"]
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export const Chat = mongoose.model("Chat", chatSchema);