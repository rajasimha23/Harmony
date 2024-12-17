import {useNavigate } from "react-router-dom";
import useAuth from "../../store/Auth";

function AddHeader () {
    const navigate = useNavigate();
    const {user} = useAuth();

    return (
        <header className="bg-header py-4">
            <div className="mx-2 md:mx-4 flex flex-row justify-between items-center">
                <button onClick={() => { navigate("/") }}>
                    <div className="flex ml-2">
                        <img src="logo.png" style={{ width: "2.5rem", height: "auto", objectFit: "contain" }} className="mr-3" />
                        <h1 className="text-3xl">Harmony</h1>
                    </div>
                </button>
                <div className="flex justify-center">
                    <button onClick={() => { navigate("/logout") }} className="relative group flex flex-col items-center ml-4" >
                        <img src="add2.png" style={{ width: "3.3rem", height: "auto", objectFit: "contain" }} />
                        <div className="whitespace-nowrap absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                            Add Chatroom
                        </div>
                    </button>
                    {(!user.isAdmin) ? null : (
                        <button onClick={() => { navigate("/manage") }} className="relative group flex flex-col items-center ml-5">
                            <img src="manager4.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }}/>
                            <div className="absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                                Manage
                            </div>
                        </button>
                    )}
                    <button onClick={() => { navigate("/logout") }} className="relative group flex flex-col items-center ml-5" >
                        <img src="logout7.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }} />
                        <div className="absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                            Logout
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
    
}

export default AddHeader;