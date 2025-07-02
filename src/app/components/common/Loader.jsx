import React from "react";

const Loader = ({className=""}) => {
    return (
        <svg className={`m-auto size-8 animate-spin text-white ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle className="opacity-25" cx="12" cy="12" r="8" stroke="#aaaaaa"></circle>
            <path className="opacity-75" d="M4 12a8 9 0 013-6" stroke="#d1d1d1"></path>
        </svg>
    );
};

export default Loader;
