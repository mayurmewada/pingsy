import { io } from "socket.io-client";

let socket;

export const initiateSocket = () => {
    const url = process?.env?.NEXT_PUBLIC_SOCKETAPIBASEURL;
    console.log("@@@", url)
    if (!socket) {
        socket = io(url, {
            path: "/api/socket",
        });
    }
};

export const getSocket = () => socket;
