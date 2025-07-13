import { dbConnect } from "@/db/dbConnection";
import chatModel from "@/models/chat_model";
import { Server } from "socket.io";

await dbConnect();

const handler = async (req, res) => {
    if (res?.socket?.server?.io) {
        console.log("socket.io already running...");
        res.end();
        return;
    }

    console.log("starting socket.io server...");

    const io = new Server(res?.socket?.server, {
        path: "/api/socket",
        addTrailingSlash: false,
        cors: { origin: "*" },
    });
    res.socket.server.io = io;

    io?.on("connection", (socket) => {
        console.log("New Connection", socket?.id);

        socket?.on("joinRoom", ({ chatId }) => {
            socket.join(chatId);
            console.log(`${socket?.id} joined chat ${chatId}`);
        });

        socket?.on("sendMessage", async ({ chatId, message, userId }) => {
            console.log("1------", userId);
            console.log("1------1", userId);
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
            console.log("2------");

            await io?.to(chatId).emit("receiveMessage", {
                message,
                userId,
                time: await new String(Date.now()),
            });
            console.log("3------");
        });
    });
    res.end();
};

export default handler;
