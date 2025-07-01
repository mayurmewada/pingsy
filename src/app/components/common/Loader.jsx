import React from "react";

const Loader = ({className=""}) => {
    return (
        <svg className={`m-auto size-8 animate-spin text-white ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle className="opacity-25" cx="12" cy="12" r="9" stroke="#C5CBD1"></circle>
            <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="#384047"></path>
        </svg>
    );
};

export default Loader;
