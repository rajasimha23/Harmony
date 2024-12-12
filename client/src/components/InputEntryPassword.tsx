type InputEntryFormat = {
    name:string;
    text:string;
    placeholder:string;
    changeFunction: React.ChangeEventHandler<HTMLInputElement>;
    value?:string;
}

import React from "react";

function InputEntryPassword(props: InputEntryFormat) {
    return <div className="text-center">   
        <label className="text-xl text-[#ffffffde]" htmlFor={props.name}>{props.text}</label><br />
        <input onChange={props.changeFunction} type="password" className="px-3 py-1 rounded-lg mb-7 mt-3 w-64 h-10 text-center bg-[#2d2d2d] text-[#ffffffde]"
            id={props.name} name={props.name} placeholder={props.placeholder} value={props.value} autoComplete="on" required/>
        <br />
    </div>
}   

export default InputEntryPassword;