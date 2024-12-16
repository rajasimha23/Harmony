import React, { useEffect, useState } from "react";
import InputEntry from "../components/InputEntry";
import {useAuth} from "../store/Auth"
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import LINK from "../store/Link";
import Loader from "../components/Loader";
import InputEntryPassword from "../components/InputEntryPassword";

function Login() {
    const navigate = useNavigate();
    const {isLoggedIn} = useAuth();
    
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/home"); 
        }
    }, [isLoggedIn]);
    
    const [isLoading, setLoading] = useState(false);
    const [user,setUser] = useState({email: "", password: ""});
    const {storeTokenInLS} = useAuth();

    function updateUser(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setUser(prevUser => { 
            const updatedUser = {
                ...prevUser,
                [name]: value,
            }
            return updatedUser;
        });
    }
    
    async function storeData() {
        setLoading(true);
        const response = await fetch(LINK + "api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }); 
        setLoading(false);
        if (response.ok) {
            toast("Successfully Logged in");
            const resp_data = await response.json();
            await storeTokenInLS(resp_data.token);
            navigate("/home");
        }
        else {
            const res_data = await response.json();
            toast(res_data.message);
        }
    }

    return <> {isLoading ? <Loader /> :
        <div className="w-full h-90vh flex flex-col justify-center items-center">
            {(isLoggedIn == false) && (<>
            <h1 className="mb-6 text-5xl text-center">Welcome To Login Page</h1>
            <InputEntry changeFunction={updateUser} name="email" text="Email" placeholder="Enter Your Email" />
            <InputEntryPassword changeFunction={updateUser} name="password" text="Password" placeholder="Enter Your Password" />
            <button className="customButton" type="submit" onClick={storeData}>Submit</button>

            <h2 className="text-2xl mb-4 mt-8">Don't have an Account?</h2>
            <button className="customButton" onClick={()=>navigate("/register")}>Register</button>
            </>)}
        </div>
        }
    </>
}   

export default Login;