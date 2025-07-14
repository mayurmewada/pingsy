"use client";
import { Formik } from "formik";
import Image from "next/image";
import { use, useEffect, useLayoutEffect, useRef, useState } from "react";
import Button from "./components/common/Button";
import Input from "./components/common/Input";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { toast, ToastContainer } from "react-toastify";
import { getSocket, initiateSocket } from "../../socket";
import { io } from "socket.io-client";
import { getFormatedDate } from "@/utils/helperFunction";

const Index = ({ userId, cookie }) => {
    const chatRef = useRef(null);

    const [loggedin, setLoggedin] = useState(cookie);
    const [loggedInUserId, setLoggedInUserId] = useState(userId);
    const [loading, setLoading] = useState(false);
    const [isLoginAuth, setIsLoginAuth] = useState(true);
    const [friendsList, setFriendsList] = useState([]);
    const [chat, setChat] = useState([]);
    const [currMsg, setCurrMsg] = useState("");
    const [msgBoxDisable, setMsgBoxDisable] = useState(false);
    const [activeChat, setActiveChat] = useState(null);

    useEffect(() => {
        if (userId !== null) {
            setLoggedInUserId(userId);
        }
    });

    useEffect(() => {
        if (loggedin) {
            fetch("http://localhost:3000/api/getFriends", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return res.json();
                })
                .then((data) => {
                    setFriendsList(data?.data || []);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {});
        }
    }, [loggedin]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/chat/all?chatId=${activeChat?.chatId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setChat(data?.data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {});

        fetch("http://localhost:3000/api/socket");
        initiateSocket();
        const socket = getSocket();
        socket.emit("joinRoom", { chatId: activeChat?.chatId });

        socket.on("receiveMessage", (msg) => {
            setChat((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [activeChat?.userId]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chat]);

    const handleMsgText = (e) => {
        setCurrMsg(e.target.value);
    };
    const handleMsgSend = async () => {
        if (currMsg?.length && loggedInUserId) {
            setMsgBoxDisable(true);

            const socket = getSocket();
            await socket.emit("sendMessage", {
                chatId: activeChat?.chatId,
                userId: loggedInUserId,
                message: currMsg,
            });
            setCurrMsg("");
            setMsgBoxDisable(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <main className="flex min-h-[100vh] relative">
                {loggedin ? (
                    <>
                        <div className={`lg:max-w-[30%] w-full main-block bg-[background-color:var(--background)] ${activeChat ? "" : "visible"}`}>
                            <div className="px-6 py-6">
                                <h1 className="font-[family-name:var(--font-vonca-medium)] text-[color:var(--textlight)] text-[28px] tracking-[1px] flex items-baseline mb-4 leading-[30px]">
                                    P<span className="text-[24px] tracking-[1px]">INGSY</span>
                                </h1>
                                <input className="bg-[background:var(--surface)] rounded-[12px] w-full h-[40px] text-[color:var(--textlight)] px-4" placeholder="Search" type="text" />
                            </div>
                            <ul className="overflow-y-scroll h-[calc(100vh-135px)] p-3">
                                {friendsList?.map((friend) => (
                                    <li
                                        key={friend?.lastMessageTime}
                                        onClick={() => {
                                            setActiveChat({
                                                chatId: friend?.chatId,
                                                userId: friend?.userId,
                                                username: friend?.username,
                                            });
                                        }}
                                        className={`p-3 flex items-center gap-3 ${friend?.userId === activeChat?.userId ? "bg-[background:var(--surface)] rounded-[12px]" : ""}`}
                                    >
                                        <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] rounded-[50%] bg-[#333333]"></div>
                                        <div className="text-[color:var(--textlight)] w-full flex flex-col justify-center gap-[2px]">
                                            <div className="flex justify-between items-baseline">
                                                <span className="leading-[1]">{friend?.username}</span>
                                                <span className="text-[13px] opacity-[0.7]">{friend?.lastMessageTime}</span>
                                            </div>
                                            <span className="line-clamp-[1] text-[13px] opacity-[0.7]">{friend?.lastMessage}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={`lg:max-w-[70%] w-full absolute lg:relative inset-[0] chat-block lg:border-l-[1px] lg:border-l-[border-left-color:var(--surface)] flex flex-col ${activeChat ? "visible" : ""}`}>
                            <div className="w-full px-5 py-4 text-[color:var(--textdark)]">
                                <div className="flex items-center gap-3">
                                    <Button onClick={() => setActiveChat(null)} className={"lg:hidden cursor-pointer mr-3"} leadingIcon={<i className="ri-arrow-left-s-line text-[30px] font-normal"></i>} variant={"text"} />
                                    <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] rounded-[50%] bg-[#333333]"></div>
                                    <div className="text-[color:var(--textlight)] w-full flex flex-col justify-center gap-[2px]">
                                        <div className="flex justify-between items-baseline">
                                            <span className="leading-[1] text-[18px]">{activeChat?.username}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[400px] h-[calc(100vh-154px)] border-y-[1px] border-y-[border-left-color:var(--surface)] w-full relative">
                                <Image className="absolute w-full h-full object-cover opacity-[50%] inset-[0] invert-[1] z-[-1]" src={"/images/chatbg.png"} alt="chat-background-vector" width={800} height={600} />
                                <div ref={chatRef} className="px-4 py-4 overflow-y-scroll h-full">
                                    <ul className="flex flex-col gap-y-3">
                                        {loggedInUserId &&
                                            chat?.map((message) => (
                                                <li key={`${message?.time}-${message?.message}`} className={`text-[#fff] max-w-[70%] w-fit inline py-2 px-3 rounded-[8px] shadow-xl ${message?.userId === loggedInUserId ? "bg-[background:var(--primary-surface)] ms-auto" : "bg-[background:var(--surface)]"}`}>
                                                    {message?.message}
                                                    <p className="text-[12px] mt-2 opacity-[50%]">{getFormatedDate(Number(message?.time))}</p>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="w-full px-5 py-4 text-[color:var(--textdark)]">
                                {loggedInUserId ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleMsgSend();
                                        }}
                                    >
                                        <input disabled={msgBoxDisable} value={currMsg} className="bg-[background:var(--surface)] rounded-[12px] w-full h-[40px] text-[color:var(--textlight)] px-4" onChange={handleMsgText} placeholder="Type Message" type="text" />
                                    </form>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full border-l-[1px] border-l-[border-left-color:var(--surface)] flex flex-col">
                        <div className="w-[400px] h-[200px] border-y-[1px] border-y-[border-left-color:var(--surface)] h-full w-full relative">
                            <Image className="absolute w-full h-full object-cover opacity-[50%] inset-[0] invert-[1] z-[-1]" src={"/images/chatbg.png"} alt="chat-background-vector" width={800} height={600} />
                            <div className="flex flex-col justify-center items-center h-full px-4">{isLoginAuth ? <Login setIsLoginAuth={setIsLoginAuth} setLoggedin={setLoggedin} setLoggedInUserId={setLoggedInUserId} /> : <Signup setIsLoginAuth={setIsLoginAuth} />}</div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default Index;
