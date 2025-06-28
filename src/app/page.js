"use client";
import { Formik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "./components/Button";
import Input from "./components/Input";

export default function Home() {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ username: "example", email: "abc", password: "123" }),
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
                console.log(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <main className="flex min-h-[100vh]">
            <div className="max-w-[30%] w-full">
                <div className="px-6 py-6">
                    <h1 className="font-[family-name:var(--font-vonca-medium)] text-[color:var(--textlight)] text-[28px] tracking-[1px] flex items-baseline mb-4 leading-[30px]">
                        P<span className="text-[24px] tracking-[1px]">INGSY</span>
                    </h1>
                    <input className="bg-[background:var(--surface)] rounded-[12px] w-full h-[40px] text-[color:var(--textlight)] px-4" placeholder="Search" type="text" />
                </div>
                <div className="overflow-y-scroll h-[calc(100vh-135px)] p-3">
                    <div className="p-3 flex items-center gap-3">
                        <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] rounded-[50%] bg-[#333333]"></div>
                        <div className="text-[color:var(--textlight)] w-full flex flex-col justify-center gap-[2px]">
                            <div className="flex justify-between items-baseline">
                                <span className="leading-[1]">username</span>
                                <span className="text-[13px] opacity-[0.7]">08:48 PM</span>
                            </div>
                            <span className="line-clamp-[1] text-[13px] opacity-[0.7]">Hello, How are you ? Hope you are doing good</span>
                        </div>
                    </div>
                    <div className="p-3 flex items-center gap-3 bg-[background:var(--surface)] rounded-[12px]">
                        <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] rounded-[50%] bg-[#333333]"></div>
                        <div className="text-[color:var(--textlight)] w-full flex flex-col justify-center gap-[2px]">
                            <div className="flex justify-between items-baseline">
                                <span className="leading-[1]">username</span>
                                <span className="text-[13px] opacity-[0.7]">08:48 PM</span>
                            </div>
                            <span className="line-clamp-[1] text-[13px] opacity-[0.7]">Hello, How are you ? Hope you are doing good</span>
                        </div>
                    </div>
                    <div className="p-3 flex items-center gap-3">
                        <div className="min-w-[50px] max-w-[50px] min-h-[50px] max-h-[50px] rounded-[50%] bg-[#333333]"></div>
                        <div className="text-[color:var(--textlight)] w-full flex flex-col justify-center gap-[2px]">
                            <div className="flex justify-between items-baseline">
                                <span className="leading-[1]">username</span>
                                <span className="text-[13px] opacity-[0.7]">08:48 PM</span>
                            </div>
                            <span className="line-clamp-[1] text-[13px] opacity-[0.7]">Hello, How are you ? Hope you are doing good</span>
                        </div>
                    </div>
                </div>
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
                    <div className="flex flex-col justify-center items-center h-full">
                        <div className="bg-white shadow-elevationMiddle max-w-[414px] w-full py-9 px-6 mb-[64px]">
                            <h3 className="text-[32px] font-semibold mt-8 mb-7">Login</h3>
                            <Formik
                                initialValues={{ email: "", password: "" }}
                                validate={(values) => {
                                    const errors = {};
                                    if (!values.email) {
                                        errors.email = "Required";
                                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                        errors.email = "Invalid email address";
                                    }
                                    if (!values.password) {
                                        errors.password = "Required";
                                    }
                                    return errors;
                                }}
                                onSubmit={(values, { setSubmitting }) => {
                                    handleFormSubmit(values);
                                }}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    isSubmitting,
                                    /* and other goodies */
                                }) => (
                                    <form className="flex flex-col" onSubmit={handleSubmit}>
                                        <div className="mb-6">
                                            <Input type="email" label="email" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />
                                            <span className="text-[13px] text-red-500">{errors.email && touched.email && errors.email}</span>
                                        </div>
                                        <div className="mb-6">
                                            <Input type="password" label="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                                            <span className="text-[13px] text-red-500">{errors.password && touched.password && errors.password}</span>
                                        </div>
                                        <Button isLoading={loading} variant={"primary"} size={"large"} title={"Submit"} disabled={isSubmitting} trailingIcon={<i className="ri-arrow-right-fill"></i>} type={"submit"} />
                                    </form>
                                )}
                            </Formik>
                            <Button className={"mt-8 mb-5"} title="Forgot Password" leadingIcon={<i className="ri-question-fill font-normal text-[18px]"></i>} />
                            <p className="inline-flex whitespace-pre mb-4">
                                Need Access ? <Button onClick={() => navigate("/signup")} title={"Create An Account"} />
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full px-5 py-4 text-[color:var(--textdark)]">
                    <input className="bg-[background:var(--surface)] rounded-[12px] w-full h-[40px] text-[color:var(--textlight)] px-4" placeholder="Type Message" type="text" />
                </div>
            </div>
        </main>
    );
}
