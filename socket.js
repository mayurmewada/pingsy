import { io } from "socket.io-client";

let socket;

export const initiateSocket = () => {
    if (!socket) {
        socket = io(process.env.APIURL, {
            path: "/api/socket",
        });
    }
};

export const getSocket = () => socket;
