import { io } from "socket.io-client";

let socket;

export const initiateSocket = () => {
    if (!socket) {
        socket = io("http://localhost:3000", {
            path: "/api/socket",
        });
    }
};

export const getSocket = () => socket;
