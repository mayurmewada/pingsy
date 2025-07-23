import { Formik } from "formik";
import React, { useState } from "react";
import Input from "./common/Input";
import Button from "./common/Button";
import { toast } from "react-toastify";

const Signup = ({ setIsLoginAuth }) => {
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const handleFormSubmit = (values) => {
        setLoading(true);
        fetch(`/api/auth/signup`, {
            method: "POST",
            body: JSON?.stringify(values),
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
                if (data?.status === 400) {
                    setUsernameError(true);
                } else {
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
                    setIsLoginAuth(true);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <div className="bg-[background:var(--background)] shadow-lg border border-[border-color:var(--surface)] max-w-[414px] w-full py-9 px-6 mb-[64px] text-[color:var(--textlight)]">
            <h1 className="font-[family-name:var(--font-vonca-medium)] text-[color:var(--textlight)] text-[34px] tracking-[1px] flex items-baseline mb-4 leading-[30px]">
                P<span className="text-[28px] tracking-[1px]">INGSY</span>
            </h1>
            <h3 className="text-[28px] mt-8 mb-7">Create an Account</h3>
            <Formik
                initialValues={{ email: "", username: "", password: "" }}
                validate={(values) => {
                    const errors = {};
                    if (!values.email) {
                        errors.email = "Required";
                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                        errors.email = "Invalid email address";
                    }
                    if (!values.username) {
                        errors.username = "Required and should be Unique for every User";
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
                            <Input
                                type="text"
                                label="username"
                                name="username"
                                onChange={(e) => {
                                    handleChange(e); // ← Formik updates state
                                    setUsernameError(false); // ← Your custom logic
                                }}
                                onBlur={handleBlur}
                                value={values.username}
                            />
                            {usernameError ? <span className="text-[13px] text-red-500">Username not Available</span> : <span className="text-[13px] text-red-500">{errors.username && touched.username && errors.username}</span>}
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
                Already have an Account ? <Button onClick={() => setIsLoginAuth(true)} title={"Login"} />
            </p>
        </div>
    );
};

export default Signup;
