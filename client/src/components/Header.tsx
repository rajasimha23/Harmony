import {useNavigate } from "react-router-dom";
import useAuth from "../store/Auth";

function Header () {
    const navigate = useNavigate();
    const {user} = useAuth();

    return (
        <header className="bg-[#2d2d2d] py-4">
            <div className="mx-5 md:mx-7 flex flex-row">
                <button onClick={() => { navigate("/") }}>
                    <h1 className="text-3xl md:text-3xl w-4/12">Harmony</h1>
                </button>
                <div className="flex-1 flex justify-center  w-4/12">
                    {(!user.isAdmin) ? null : (
                        <button onClick={() => { navigate("/manage") }}>
                            <h1 className="text-3xl md:text-3xl">Manage</h1>
                        </button>
                    )}
                </div>
                <button onClick={() => { navigate("/logout") }}>
                    <h1 className="text-3xl  w-4/12">Logout</h1>
                </button>
            </div>
        </header>
    );
    
}

export default Header;