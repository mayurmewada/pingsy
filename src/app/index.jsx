"use client";
import { Formik } from "formik";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import Button from "./components/common/Button";
import Input from "./components/common/Input";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { toast, ToastContainer } from "react-toastify";

const Index = ({ cookie }) => {
    const [loggedin, setLoggedin] = useState(cookie);
    const [loading, setLoading] = useState(false);
    const [isLoginAuth, setIsLoginAuth] = useState(true);
    const [freindsList, setFriendsList] = useState([]);

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

    return (
        <>
            <ToastContainer />
            <main className="flex min-h-[100vh]">
                {loggedin ? (
                    <>
                        <div className="max-w-[30%] w-full">
                            <div className="px-6 py-6">
                                <h1 className="font-[family-name:var(--font-vonca-medium)] text-[color:var(--textlight)] text-[28px] tracking-[1px] flex items-baseline mb-4 leading-[30px]">
                                    P<span className="text-[24px] tracking-[1px]">INGSY</span>
                                </h1>
                                <input className="bg-[background:var(--surface)] rounded-[12px] w-full h-[40px] text-[color:var(--textlight)] px-4" placeholder="Search" type="text" />
                            </div>
                            <ul className="overflow-y-scroll h-[calc(100vh-135px)] p-3">
                                {freindsList?.map((freind) => (
                                    <li key={freind?.lastMessageTime} className={`p-3 flex items-center gap-3 ${false ? "bg-[background:var(--surface)] rounded-[12px]" : ""}`}>
                                        <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] rounded-[50%] bg-[#333333]"></div>
                                        <div className="text-[color:var(--textlight)] w-full flex flex-col justify-center gap-[2px]">
                                            <div className="flex justify-between items-baseline">
                                                <span className="leading-[1]">{freind?.username}</span>
                                                <span className="text-[13px] opacity-[0.7]">{freind?.lastMessageTime}</span>
                                            </div>
                                            <span className="line-clamp-[1] text-[13px] opacity-[0.7]">{freind?.lastMessage}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="max-w-[70%] w-full border-l-[1px] border-l-[border-left-color:var(--surface)] flex flex-col">
                            <div className="w-full px-5 py-4 text-[color:var(--textdark)]">
                                <div className="flex items-center gap-3">
                                    <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] rounded-[50%] bg-[#333333]"></div>
                                    <div className="text-[color:var(--textlight)] w-full flex flex-col justify-center gap-[2px]">
                                        <div className="flex justify-between items-baseline">
                                            <span className="leading-[1] text-[18px]">username</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[400px] h-[200px] border-y-[1px] border-y-[border-left-color:var(--surface)] h-full w-full relative">
                                <Image className="absolute w-full h-full object-cover opacity-[50%] inset-[0] invert-[1] z-[-1]" src={"/images/chatbg.png"} alt="chat-background-vector" width={800} height={600} />
                            </div>
                            <div className="w-full px-5 py-4 text-[color:var(--textdark)]">
                                <input className="bg-[background:var(--surface)] rounded-[12px] w-full h-[40px] text-[color:var(--textlight)] px-4" placeholder="Type Message" type="text" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full border-l-[1px] border-l-[border-left-color:var(--surface)] flex flex-col">
                        <div className="w-[400px] h-[200px] border-y-[1px] border-y-[border-left-color:var(--surface)] h-full w-full relative">
                            <Image className="absolute w-full h-full object-cover opacity-[50%] inset-[0] invert-[1] z-[-1]" src={"/images/chatbg.png"} alt="chat-background-vector" width={800} height={600} />
                            <div className="flex flex-col justify-center items-center h-full px-4">{isLoginAuth ? <Login setIsLoginAuth={setIsLoginAuth} setLoggedin={setLoggedin} /> : <Signup setIsLoginAuth={setIsLoginAuth} />}</div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default Index;
