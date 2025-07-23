import { dbConnect } from "@/db/dbConnection";
import chatModel from "@/models/chat_model";
import { Server } from "socket.io";

await dbConnect();

const handler = async (req, res) => {
    if (res?.socket?.server?.io) {
        res.end();
        return;
    }

    const io = new Server(res?.socket?.server, {
        path: "/api/socket",
        addTrailingSlash: false,
        cors: { origin: "*" },
    });
    res.socket.server.io = io;

    io?.on("connection", (socket) => {

        socket?.on("joinRoom", ({ chatId }) => {
            socket.join(chatId);
        });

        socket?.on("sendMessage", async ({ chatId, message, userId }) => {
            const newMessage = await chatModel.findOneAndUpdate(
                { _id: chatId },
                {
                    $push: {
                        chat: {
                            message,
                            userId,
                            time: await new String(Date.now()),
                        },
                    },
                },
                { new: true, upsert: false, runValidators: true }
            );

            await io?.to(chatId).emit("receiveMessage", {
                message,
                userId,
                time: await new String(Date.now()),
            });
        });
    });
    res.end();
};

export default handler;
