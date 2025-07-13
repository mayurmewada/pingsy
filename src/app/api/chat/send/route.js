import chatModel from "@/models/chat_model";

const { dbConnect } = require("@/db/dbConnection");

dbConnect();

export const POST = async (request) => {
    try {
        const req = await request.json();
        console.log(req);
        await chatModel.findOneAndUpdate(
            { _id: req.chatId },
            {
                $push: {
                    chat: {
                        message: req?.message,
                        userId: req?.userId,
                        time: await new String(Date.now()),
                    },
                },
            },
            { new: true, upsert: false, runValidators: true }
        );
        return Response.json({ status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ status: 500, errMsg: error });
    }
};
