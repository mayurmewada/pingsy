import { auth } from "@/lib/auth";
import chatModel from "@/models/chat_model";

const { dbConnect } = require("@/db/dbConnection");

dbConnect();

export const GET = async (request) => {
    return auth(async () => {
        try {
            const req = await request;
            const { searchParams } = new URL(req.url);
            const chatId = searchParams.get("chatId");
            if (!chatId) return Response.json({ starus: 400, message: "ChatId Required" });
            const chats = await chatModel.findOne({ _id: chatId });
            return Response.json({ status: 200, data: chats?.chat });
        } catch (error) {
            console.log(error);
            return Response.json({ status: 500, errMsg: error });
        }
    });
};
