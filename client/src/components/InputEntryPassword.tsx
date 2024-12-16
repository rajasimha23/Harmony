// type InputEntryFormat = {
//     name:string;
//     text:string;
//     placeholder:string;
//     changeFunction: React.ChangeEventHandler<HTMLInputElement>;
//     value?:string;
// }

// import React from "react";

// function InputEntryPassword(props: InputEntryFormat) {
//     return <div className="text-center">   
//         <label className="text-xl text-[#ffffffde]" htmlFor={props.name}>{props.text}</label><br />
//         <input onChange={props.changeFunction} type="password" className="px-3 py-1 rounded-lg mb-7 mt-3 w-64 h-10 text-center bg-[#2d2d2d] text-[#ffffffde]"
//             id={props.name} name={props.name} placeholder={props.placeholder} value={props.value} autoComplete="on" required/>
//         <br />
//     </div>
// }   

// export default InputEntryPassword;
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons from react-icons

type InputEntryFormat = {
    name: string;
    text: string;
    placeholder: string;
    changeFunction: React.ChangeEventHandler<HTMLInputElement>;
    value?: string;
};

function InputEntryPassword(props: InputEntryFormat) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div className="text-center relative">
            <label className="text-xl text-[#ffffffde]" htmlFor={props.name}>{props.text}</label><br />
            
            <div className="relative">
                <input
                    onChange={props.changeFunction}
                    type={showPassword ? "text" : "password"} 
                    className="px-3 py-1 rounded-lg mb-3 mt-3 w-64 h-10 text-center bg-[#2d2d2d] text-[#ffffffde]"
                    id={props.name}
                    name={props.name}
                    placeholder={props.placeholder}
                    value={props.value}
                    autoComplete="on"
                    required
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-[33px] transform -translate-y-1/2 text-[#ffffffde] text-xl"
                >
                    {!showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>
            <br />
        </div>
    );
}

export default InputEntryPassword;
