import {Chat} from '../models/chat.model.js'
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import {User} from '../models/user.model.js'
import mongoose from 'mongoose';

// common aggregate pipleline
const chatCommonAggregationPipeline = () => {
    return [
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "participants",
                as: "participants",
                pipeline: [
                    {
                        $project: {
                            password: 0,
                            refreshToken: 0
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "messages",
                foreignField: "_id",
                localField: "latestMessage",
                as: "latestMessage",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            foreignField: "_id",
                            localField: "sender",
                            as: "sender",
                            pipeline: [
                                {
                                    $project: {
                                        avatar: 1,
                                        email: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            sender: {
                                $first: "$sender"
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                latestMessage: {
                    $first: "$latestMessage"
                }
            }
        }
    ]
}


const searchAvailableUser = asyncHandler(async(req, res) => {
    const users = await User.aggregate([
        {
            $match: {
                _id: {$ne: req.user?._id}
            }
        },
        {
            $project: {
                avatar: 1,
                username: 1,
                email: 1,
                fullname: 1
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, users, "all user fetched successfully"));
})

const createOrGetOneToOneChat = asyncHandler(async(req, res) => {
    const {recieverId} = req.params;

    const reciever = await User.findById(recieverId);

    if(!reciever) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    // check if logged in user and reciever id should not be same

    if(req.user?._id.toString() === reciever._id.toString()) {
        return res.status(400).json(new ApiResponse(400, null, "You chat with yourself"));
    }

    const chat = await Chat.aggregate([
        {
            $match: {
                isGroupChat: false,
                // users: {

                //     // $all: doesn't works with nested object instead works directly on the element
                //     // $all: [new mongoose.Schema.Types.ObjectId(req.user?._id), new mongoose.Schema.Types.ObjectId(recieverId)]


                // }

                $and: [
                    {
                        participants: req.user?._id
                    },
                    {
                        participants: new mongoose.Types.ObjectId(recieverId)
                    }
                ]
            }
        },
        ...chatCommonAggregationPipeline()
    ])

    if(chat.length) {
        return res.status(200).json(new ApiResponse(200, chat[0], "Chat retrived successfully"));
    }

    const newChatInstance = await Chat.create({
        name: "One to One Chat",
        participants: [req.user?._id, new mongoose.Types.ObjectId(recieverId)],
        groupAdmin: req.user?._id
    })

    const createdChat = await Chat.aggregate([
        {
            $match: {
                _id: newChatInstance._id
            }
        },
        ...chatCommonAggregationPipeline()
    ])

    return res.status(200).json(new ApiResponse(200, createdChat[0], "chat fetched successfully"));
    // logic to emit socket event about the new chat to added pariticipants

    // chat[0]?.participants?.forEach((participant) => {
        
    //     emitSocketEvent(
    //         req, 
    //         participant._id?.toString(),
            
    //     )
    // })

    // socket.io
})


export {searchAvailableUser, createOrGetOneToOneChat}