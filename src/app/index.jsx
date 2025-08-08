"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Button from "./components/common/Button";
import Input from "./components/common/Input";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { toast, ToastContainer } from "react-toastify";
import { getSocket, initiateSocket } from "../../socket";
import { base64ToUint8Array, decryptMsg, decryptPrivateKey, encryptMsg, getFormatedDate, uint8ArrayToBase64 } from "@/utils/helperFunction";
import Loader from "./components/common/Loader";

const Index = ({ userId, cookie, privateKey, publicKey }) => {
    const chatRef = useRef(null);
    // state for socket status
    const [isSocketUp, setIsSocketUp] = useState(false);

    // states for loggedin user
    const [loggedin, setLoggedin] = useState(cookie);
    const [loggedInUserId, setLoggedInUserId] = useState(userId);
    const [userPrivateKey, setUserPrivateKey] = useState(privateKey);
    const [userPublicKey, setUserPublicKey] = useState(publicKey);

    // state for login / signup form
    const [isLoginAuth, setIsLoginAuth] = useState(true);

    // states for search
    const [searchText, setSearchText] = useState("");
    const [showFindFriends, setShowFindFriends] = useState(false);
    const [searchResultLoading, setSearchResultLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [sendRequestBtnLoading, setSendRequestBtnLoading] = useState("");

    //  state for friend requests
    const [showFriendRequests, setShowFriendRequests] = useState(false);
    const [friendRequestsLoading, setFriendRequestsLoading] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [refetchFriendRequests, setRefetchFriendRequests] = useState(false);
    const [friendRequestsActionBtnLoading, setFriendRequestsActionBtnLoading] = useState("");

    // states for my chats
    const [friendsListLoading, setFriendsListLoading] = useState(false);
    const [friendsList, setFriendsList] = useState([]);
    const [refetchFriendsList, setRefetchFriendsList] = useState(false);

    //  states for active / current chat
    const [activeChat, setActiveChat] = useState(null);
    const [chatLoading, setChatLoading] = useState(false);
    const [chat, setChat] = useState([]);

    // states for message input
    const [currMsg, setCurrMsg] = useState("");
    const [msgBoxDisable, setMsgBoxDisable] = useState(false);

    useEffect(() => {
        if (!isSocketUp) {
            fetch(`${process.env.NEXT_PUBLIC_SOCKETAPIBASEURL}/api/wakeup`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("");
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data?.code === "SOCKET_READY_TO_CONNECT") {
                        setIsSocketUp(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setFriendsListLoading(false);
                });
        }
    }, []);

    // set loggedin userid
    useEffect(() => {
        if (userId !== null) {
            setLoggedInUserId(userId);
        }
    }, []);

    // handlers for search input
    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);
    };
    const handleSearchTextSend = () => {
        if (searchText?.length >= 3) {
            setSearchResultLoading(true);
            fetch(`${process?.env?.NEXT_PUBLIC_APIBASEURL}/api/friends/find/${searchText}`, {
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
                .then(({ data }) => {
                    setSearchResult(data);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setSearchResultLoading(false);
                });
        }
    };

    // handler for send friend request
    const handleSendRequest = (id, username) => {
        setSendRequestBtnLoading(id);
        fetch(`${process?.env?.NEXT_PUBLIC_APIBASEURL}/api/friends/request/send`, {
            method: "POST",
            body: JSON.stringify({ id, username }),
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
                toast.success(data?.message, {
                    className: "!bg-[background:var(--surface)]",
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setRefetchFriendRequests(true);
                setSendRequestBtnLoading("");
            });
    };

    // fetch friend request
    useEffect(() => {
        if (showFriendRequests) {
            setFriendRequestsLoading(true);
            fetch(`${process?.env?.NEXT_PUBLIC_APIBASEURL}/api/friends/request/all`, {
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
                    setFriendRequests(data?.data);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setFriendRequestsLoading(false);
                    setRefetchFriendRequests(false);
                });
        }
    }, [showFriendRequests, refetchFriendRequests]);

    // handler for friend request action
    const handleFriendRequestAction = (userId, username, action) => {
        setFriendRequestsActionBtnLoading(userId);
        fetch(`${process?.env?.NEXT_PUBLIC_APIBASEURL}/api/friends/request/${action}`, {
            method: "POST",
            body: JSON.stringify({ userId, username }),
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
                toast.success(data?.message, {
                    className: "!bg-[background:var(--surface)]",
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setRefetchFriendRequests(true);
                setFriendRequestsActionBtnLoading("");
                if (action === "accept") setRefetchFriendsList(true);
            });
    };

    // fetch my chats
    useEffect(() => {
        if (isSocketUp) {
            if (loggedin) {
                setFriendsListLoading(true);
                fetch(`${process?.env?.NEXT_PUBLIC_APIBASEURL}/api/friends/get`, {
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
                    .finally(() => {
                        setFriendsListLoading(false);
                        setRefetchFriendsList(false);
                    });
            }
        }
    }, [loggedin, refetchFriendsList, isSocketUp]);

    // fetch selected user chats
    useEffect(() => {
        setChatLoading(true);
        fetch(`${process?.env?.NEXT_PUBLIC_APIBASEURL}/api/chat/all?chatId=${activeChat?.chatId}`, {
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
            .finally(() => {
                setChatLoading(false);
            });

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

    // stick chat to bottom first
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chat]);

    // handlers for message input
    const handleMsgText = (e) => {
        setCurrMsg(e.target.value);
    };
    const handleMsgSend = async () => {
        const receiver = encryptMsg(currMsg, String(base64ToUint8Array(activeChat?.publicKey)), userPrivateKey);
        const sender = encryptMsg(currMsg, userPublicKey, userPrivateKey);
        if (currMsg?.length && loggedInUserId) {
            setMsgBoxDisable(true);

            const socket = getSocket();
            await socket.emit("sendMessage", {
                chatId: activeChat?.chatId,
                userId: loggedInUserId,
                message: {
                    forReceiver: uint8ArrayToBase64(receiver?.encryptedMsg),
                    forSender: uint8ArrayToBase64(sender?.encryptedMsg),
                },
                nonce: {
                    forReceiver: uint8ArrayToBase64(receiver?.nonce),
                    forSender: uint8ArrayToBase64(sender?.nonce),
                },
            });
            setCurrMsg("");
            setMsgBoxDisable(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <main className="flex min-h-[100dvh] relative overflow-hidden">
                {/* loggedin content */}
                {loggedin ? (
                    <>
                        {/* main section / left side section */}
                        <div className={`lg:max-w-[30%] w-full main-block bg-[background-color:var(--background)] ${activeChat ? "" : "visible"}`}>
                            {/* branding / search section */}
                            <div className="px-6">
                                <h1 className="font-[family-name:var(--font-vonca-medium)] text-[color:var(--textlight)] text-[28px] tracking-[1px] flex items-baseline leading-[82px]">
                                    P<span className="text-[24px] tracking-[1px]">INGSY</span>
                                </h1>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSearchTextSend();
                                    }}
                                >
                                    <Input onFocus={() => setShowFindFriends(true)} placeholder={"Search"} name="username" type="text" onChange={handleSearchTextChange} value={searchText} />
                                </form>
                            </div>
                            {/* search result / friend requests / my chats */}
                            <div className="overflow-y-scroll h-[calc(100dvh-123px)] pt-5">
                                {/* find friends / search results */}
                                {showFindFriends ? (
                                    <div className="mb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white opacity-[0.7] px-6">Find Friends</span>
                                            <Button
                                                onClick={() => {
                                                    setShowFindFriends(false);
                                                    setSearchText("");
                                                }}
                                                className={"cursor-pointer opacity-[0.7] mr-3"}
                                                leadingIcon={<i className="ri-close-fill text-[18px] font-normal"></i>}
                                                variant={"text"}
                                            />
                                        </div>
                                        {searchText.length < 3 ? (
                                            <p className="text-[13px] opacity-[0.7] text-white px-6 pt-3 pb-5">Type minimum 3 letters to search for Friends.</p>
                                        ) : searchResultLoading ? (
                                            <Loader />
                                        ) : (
                                            <ul className="p-3">
                                                {searchResult?.map((friend) => (
                                                    <li key={friend?._id} className={`p-3 flex items-center gap-3`}>
                                                        <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] rounded-[50%] bg-[#333333]"></div>
                                                        <div className="text-[color:var(--textlight)] w-full flex flex-col justify-center gap-[2px]">
                                                            <div className="flex justify-between items-center">
                                                                <span className="leading-[1]">{friend?.username}</span>
                                                                <Button isLoading={friend?._id === sendRequestBtnLoading} onClick={() => handleSendRequest(friend?._id, friend?.username)} className={"!px-2"} leadingIcon={<i className="ri-add-fill text-[18px] font-normal"></i>} size={"small"} variant={"secondary"} />
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    ""
                                )}
                                {/* friend requests */}
                                <div className="mb-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white opacity-[0.7] px-6">Friend Requests</span>
                                        <Button onClick={() => setShowFriendRequests(!showFriendRequests)} className={"cursor-pointer opacity-[0.7] mr-3"} leadingIcon={<i className={`${showFriendRequests ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} text-[18px] font-normal`}></i>} variant={"text"} />
                                    </div>
                                    {showFriendRequests ? (
                                        <ul className="p-3">
                                            {friendRequestsLoading ? (
                                                <Loader />
                                            ) : friendRequests?.length > 0 ? (
                                                friendRequests?.map((request) => (
                                                    <li key={request?.userId} className={`p-3 flex items-center gap-3`}>
                                                        <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] rounded-[50%] bg-[#333333]"></div>
                                                        <div className="text-[color:var(--textlight)] w-full flex flex-col justify-center gap-[2px]">
                                                            <div className="flex justify-between items-center">
                                                                <span className="leading-[1]">{request?.username}</span>
                                                                <div className="flex items-center gap-3">
                                                                    {friendRequestsActionBtnLoading ? (
                                                                        <Loader />
                                                                    ) : (
                                                                        <>
                                                                            <Button onClick={() => handleFriendRequestAction(request?.userId, request?.username, "reject")} className={"!px-2"} leadingIcon={<i className="ri-close-fill text-[18px] font-normal"></i>} size={"small"} variant={"secondary"} />
                                                                            <Button onClick={() => handleFriendRequestAction(request?.userId, request?.username, "accept")} className={"!px-2"} leadingIcon={<i className="ri-check-fill text-[18px] font-normal"></i>} size={"small"} variant={"secondary"} />
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <p className="text-[13px] opacity-[0.7] text-white px-3 pb-5">No Friend Request</p>
                                            )}
                                        </ul>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                {/* my chats */}
                                <div>
                                    <span className="text-white opacity-[0.7] px-6">Chats</span>
                                    <ul className="p-3">
                                        {friendsListLoading ? (
                                            <Loader />
                                        ) : friendsList.length > 0 ? (
                                            friendsList?.map((friend) => (
                                                <li
                                                    key={friend?.lastMessageTime}
                                                    onClick={() => {
                                                        setActiveChat({
                                                            chatId: friend?.chatId,
                                                            userId: friend?.userId,
                                                            username: friend?.username,
                                                            publicKey: friend?.publicKey,
                                                        });
                                                    }}
                                                    className={`p-3 flex items-center gap-3 ${friend?.userId === activeChat?.userId ? "bg-[background:var(--surface)] rounded-[12px]" : ""}`}
                                                >
                                                    <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] rounded-[50%] bg-[#333333]"></div>
                                                    <div className="text-[color:var(--textlight)] w-full flex flex-col justify-center gap-[2px]">
                                                        <div className="flex justify-between items-baseline">
                                                            <span className="leading-[1]">{friend?.username}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-[13px] opacity-[0.7] text-white px-3 pb-5">No Chat! Search and make friends to Chat</p>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* chat section / right side section */}
                        <div className={`lg:max-w-[70%] w-full absolute lg:relative inset-[0] chat-block lg:border-l-[1px] lg:border-l-[border-left-color:var(--surface)] flex flex-col ${activeChat ? "visible" : ""}`}>
                            {activeChat ? (
                                <div className="w-full lg:pl-5 pr-5 py-4 text-[color:var(--textdark)]">
                                    <div className="flex items-center gap-3">
                                        <Button onClick={() => setActiveChat(null)} className={"lg:hidden cursor-pointer pl-3 pr-1"} leadingIcon={<i className="ri-arrow-left-s-line text-[30px] font-normal"></i>} variant={"text"} />
                                        <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] rounded-[50%] bg-[#333333]"></div>
                                        <div className="text-[color:var(--textlight)] w-full flex flex-col justify-center gap-[2px]">
                                            <div className="flex justify-between items-baseline">
                                                <span className="leading-[1] text-[18px]">{activeChat?.username}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            <div className={`w-[400px] ${activeChat ? "h-[calc(100dvh-154px)]" : "h-[100dvh]"} border-y-[1px] border-y-[border-left-color:var(--surface)] w-full relative`}>
                                <Image className="absolute w-full h-full object-cover opacity-[50%] inset-[0] invert-[1] z-[-1]" src={"/images/chatbg.png"} alt="chat-background-vector" width={800} height={600} />
                                <div ref={chatRef} className="px-4 py-4 overflow-y-scroll h-full">
                                    {friendsList.length > 0 && chatLoading ? (
                                        <div className="h-full flex">
                                            <Loader />
                                        </div>
                                    ) : (
                                        <ul className="flex flex-col gap-y-3">
                                            {loggedInUserId &&
                                                chat?.map((message) => {
                                                    return (
                                                        <li key={`${message?.time}-${message?.message}`} className={`text-[#fff] max-w-[70%] w-fit inline py-2 px-3 rounded-[8px] shadow-xl ${message?.userId === loggedInUserId ? "bg-[background:var(--primary-surface)] ms-auto" : "bg-[background:var(--surface)]"}`}>
                                                            {decryptMsg(base64ToUint8Array(message?.userId === loggedInUserId ? message?.message?.forSender : message?.message?.forReceiver), base64ToUint8Array(message?.userId === loggedInUserId ? message?.nonce?.forSender : message?.nonce?.forReceiver), message?.userId === loggedInUserId ? userPublicKey : String(base64ToUint8Array(activeChat?.publicKey)), userPrivateKey)}
                                                            <p className="text-[12px] mt-2 opacity-[50%]">{getFormatedDate(Number(message?.time))}</p>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            {activeChat ? (
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
                            ) : (
                                ""
                            )}
                        </div>
                    </>
                ) : (
                    // non loggedin content
                    <div className="w-full border-l-[1px] border-l-[border-left-color:var(--surface)] flex flex-col">
                        <div className="w-[400px] h-[200px] border-y-[1px] border-y-[border-left-color:var(--surface)] h-full w-full relative">
                            <Image className="absolute w-full h-full object-cover opacity-[50%] inset-[0] invert-[1] z-[-1]" src={"/images/chatbg.png"} alt="chat-background-vector" width={800} height={600} />
                            <div className="flex flex-col justify-center items-center h-full px-4">{isLoginAuth ? <Login setIsLoginAuth={setIsLoginAuth} setLoggedin={setLoggedin} setLoggedInUserId={setLoggedInUserId} setUserPrivateKey={setUserPrivateKey} setUserPublicKey={setUserPublicKey} /> : <Signup setIsLoginAuth={setIsLoginAuth} />}</div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default Index;
