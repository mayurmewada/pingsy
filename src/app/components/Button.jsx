import React from "react";
import Loader from "./Loader";

const Button = ({ title = null, viewType = null, variant, size, isDisabled, type, onClick, onBlur = null, leadingIcon = null, trailingIcon = null, className, isLoading = false }) => {
    const styles = {
        small: "text-[11px] leading-[11px] px-3 py-[6px] h-[28px]",
        medium: "text-[13px] leading-[13px] px-4 py-2 h-[32px]",
        large: "text-[15px] leading-[16px] px-5 py-[10px] h-[40px]",

        primary: "border border-grey-600 bg-grey-600 hover:border-grey-700 hover:bg-grey-700 rounded-[8px] text-white",
        secondary: "border border-grey-600 hover:border-grey-700 bg-white hover:bg-grey-700 rounded-[8px] text-grey-600 hover:text-white",
        text: "border-white hover:border-grey-50 bg-white hover:bg-grey-50 rounded-[8px] text-grey-600 hover:text-grey-700",
    };

    return (
        <button className={`flex justify-center items-center gap-x-[6px] ${styles[variant]} ${styles[size]}${viewType === "icon" ? " !px-2" : " font-semibold"} ${isLoading ? "relative" : ""} ${className}`} onBlur={onBlur} onClick={onClick} type={type} disabled={isDisabled}>
            {isLoading ? (
                <Loader className={`${variant === "primary" ? "invert" : ""} absolute`} />
            ) : (
                <>
                    {leadingIcon && leadingIcon}
                    {title && title}
                    {trailingIcon && trailingIcon}
                </>
            )}
        </button>
    );
};

export default Button;
