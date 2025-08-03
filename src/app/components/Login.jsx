import { Formik } from "formik";
import React, { useState } from "react";
import Input from "./common/Input";
import Button from "./common/Button";
import { toast, ToastContainer } from "react-toastify";
import { decryptPrivateKey } from "@/utils/helperFunction";

const Login = ({ setIsLoginAuth, setLoggedin, setLoggedInUserId, setUserPrivateKey, setUserPublicKey }) => {
    const [loading, setLoading] = useState(false);
    const handleFormSubmit = (values) => {
        setLoading(true);
        fetch(`/api/auth/login`, {
            method: "POST",
            body: JSON.stringify(values),
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
            .then(async (data) => {
                if (data?.status === 400) {
                    toast.error(data?.message, {
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
                } else {
                    const decryptedKey = await decryptPrivateKey(data?.data?.privateKey, data?.data?.privateKeyHelper, values?.password, process.env.PINGSY_SALT);
                    document.cookie = `privateKey=${decryptedKey}; path=/; max-age=604800; secure; samesite=strict`;
                    setUserPrivateKey(decryptedKey);
                    setUserPublicKey(data?.data?.publicKey)
                    setLoggedin(true);
                    setLoggedInUserId(data?.data?.userId);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <>
            <div className="bg-[background:var(--background)] shadow-lg border border-[border-color:var(--surface)] max-w-[414px] w-full py-9 px-6 mb-[64px] text-[color:var(--textlight)]">
                <h1 className="font-[family-name:var(--font-vonca-medium)] text-[color:var(--textlight)] text-[34px] tracking-[1px] flex items-baseline mb-4 leading-[30px]">
                    P<span className="text-[28px] tracking-[1px]">INGSY</span>
                </h1>
                <h3 className="text-[28px] mt-8 mb-7">Login</h3>
                <Formik
                    initialValues={{ username: "", password: "" }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.username) {
                            errors.username = "Required";
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
                                <Input type="text" label="username" name="username" onChange={handleChange} onBlur={handleBlur} value={values.username} />
                                <span className="text-[13px] text-red-500">{errors.username && touched.username && errors.username}</span>
                            </div>
                            <div className="mb-6">
                                <Input type="password" label="password" name="password" onChange={handleChange} onBlur={handleBlur} value={values.password} />
                                <span className="text-[13px] text-red-500">{errors.password && touched.password && errors.password}</span>
                            </div>
                            <Button isLoading={loading} variant={"primary"} size={"large"} title={"Submit"} disabled={isSubmitting} trailingIcon={<i className="ri-arrow-right-fill"></i>} type={"submit"} />
                        </form>
                    )}
                </Formik>
                <Button className={"mt-8 mb-5"} title="Forgot Password" leadingIcon={<i className="ri-question-line font-normal text-[18px]"></i>} />
                <p className="inline-flex whitespace-pre mb-4">
                    New at Pingsy ? <Button onClick={() => setIsLoginAuth(false)} title={"Create An Account"} />
                </p>
            </div>
        </>
    );
};

export default Login;
