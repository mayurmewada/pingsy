import React from "react";

const Input = ({ onChange, onBlur, wrapperClass, className, label = "", type, name, placeholder, value, leadingIcon = null, trailingIcon = null, size = "large" }) => {
    const styles = {
        large: "h-[40px]",
        medium: "h-[32px]",
    };
    return (
        <div className={`flex flex-col gap-1 ${wrapperClass}`}>
            {label ? <label htmlFor={name} className="capitalize text-[16px] ">{label}</label> : ""}
            <div className={`relative w-full rounded-[8px] ${styles[size]} ${className}`}>
                {leadingIcon && <i className={`absolute top-[50%] translate-y-[-50%] left-[16px] z-[1] ${leadingIcon}`}></i>}
                <input onBlur={onBlur} onChange={onChange} value={value} className={`absolute inset-0 bg-[background:var(--surface)] rounded-[12px] w-full h-[40px] text-[color:var(--textlight)] focus:border-grey-700${leadingIcon ? " pl-[48px]" : " pl-4"}${trailingIcon ? " pr-[48px]" : " pr-4"}`} placeholder={placeholder} type={type} name={name} />
                {trailingIcon && <i className={`absolute top-[50%] translate-y-[-50%] right-[16px] z-[1] ${trailingIcon}`}></i>}
            </div>
        </div>
    );
};

export default Input;
