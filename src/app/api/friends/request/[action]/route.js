import { auth } from "@/lib/auth";
import chatModel from "@/models/chat_model";
import userModel from "@/models/user_model";
const { v4: uuidv4 } = require("uuid");

const { dbConnect } = require("@/db/dbConnection");

dbConnect();

export const POST = async (req, { params }) =>
    auth(async (decoded) => {
        try {
            const reqBody = await req.json();
            const param = await params;

            if (param?.action === "accept") {
                const newChatId = uuidv4();
                const currMoment = new String(Date.now());
                // add friend in loggedin user
                await userModel.findOneAndUpdate(
                    { _id: decoded.id },
                    {
                        $push: {
                            friends: {
                                username: reqBody.username,
                                lastMessage: "Friend Added",
                                lastMessageTime: currMoment,
                                chatId: newChatId,
                                userId: reqBody.userId,
                            },
                        },
                    },
                    { new: true, upsert: false, runValidators: true }
                );
                // remove friend request
                await userModel.findOneAndUpdate({ _id: decoded?.id }, { $pull: { request: { userId: reqBody.userId } } }, { new: true, upsert: false, runValidators: true });
                // add friend in sender
                await userModel.findOneAndUpdate(
                    { _id: reqBody.userId },
                    {
                        $push: {
                            friends: {
                                username: decoded.username,
                                lastMessage: "Your Friend Request Accepted!",
                                lastMessageTime: currMoment,
                                chatId: newChatId,
                                userId: decoded.id,
                            },
                        },
                    },
                    { new: true, upsert: false, runValidators: true }
                );
                // add chat id
                await chatModel.create({ _id: newChatId });
                return Response.json({ status: 201, message: "Friend request accepted Successfully" });
            } else if (param?.action === "reject") {
                await userModel.findOneAndUpdate({ _id: decoded?.id }, { $pull: { request: { userId: reqBody.userId } } }, { new: true, upsert: false, runValidators: true });
                return Response.json({ status: 202, message: "Friend request rejected Successfully" });
            }
        } catch (error) {
            console.log(error);
            return Response.json({ status: 500, message: error });
        }
    });
