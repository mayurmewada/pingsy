import { io } from "socket.io-client";

let socket;

export const initiateSocket = () => {
    if (!socket) {
        socket = io("https://pingsy.vercel.app", {
            path: "/api/socket",
        });
    }
};

export const getSocket = () => socket;
