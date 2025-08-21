import { io } from "socket.io-client";

const url = process?.env?.NEXT_PUBLIC_SOCKETAPIBASEURL;

let socket;

export const initiateSocket = () => {
    if (!socket) {
        socket = io(url, {
            path: "/api/socket/chat",
        });
    }
};

export const getSocket = () => socket;

let refreshFriendsSocket;

export const initiateRefreshFriendsSocket = () => {
    if (!refreshFriendsSocket) {
        refreshFriendsSocket = io(url, {
            path: "/api/socket/refresh-friends",
        });
    }
};

export const getRefreshFriendsSocket = () => refreshFriendsSocket;
