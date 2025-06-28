import React from "react";

const Input = ({ onChange, onBlur, wrapperClass, className, label = "", type, name, placeholder, value, leadingIcon = null, trailingIcon = null, size = "large" }) => {
    const styles = {
        large: "h-[40px]",
        medium: "h-[32px]",
    };
    return (
        <div className={wrapperClass}>
            {label ? (
                <label htmlFor={name} className="uppercase font-bold text-[13px] text-grey-500">
                    {label}
                </label>
            ) : (
                ""
            )}
            <div className={`relative w-full rounded-[8px] ${styles[size]} ${className}`}>
                {leadingIcon && <i className={`absolute top-[50%] translate-y-[-50%] left-[16px] z-[1] ${leadingIcon}`}></i>}
                <input onBlur={onBlur} onChange={onChange} value={value} className={`absolute inset-0 bg-[background:var(--surface)] rounded-[12px] w-full h-[40px] text-[color:var(--textlight)] px-4 focus:bg-white border border-grey-50 focus:border-grey-700${leadingIcon ? " pl-[48px]" : " pl-4"}${trailingIcon ? " pr-[48px]" : " pr-4"}`} placeholder={placeholder} type={type} name={name} />
                {trailingIcon && <i className={`absolute top-[50%] translate-y-[-50%] right-[16px] z-[1] ${trailingIcon}`}></i>}
            </div>
        </div>
    );
};

export default Input;
