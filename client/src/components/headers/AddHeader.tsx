import {useNavigate } from "react-router-dom";
import useAuth from "../../store/Auth";

type headerType = {
    addTrigger: (x:boolean)=>void;
    fileAddTrigger: (x:boolean)=>void;
}

function AddHeader (props:headerType) {
    const navigate = useNavigate();
    const {user} = useAuth();

    return (
        <header className="py-4 customHeader">
            <div className="mx-2 md:mx-6 flex flex-row justify-between items-center">
                <button onClick={() => { navigate("/") }}>
                    <div className="flex ml-2">
                        <img src="logo.png" style={{ width: "2.5rem", height: "auto", objectFit: "contain" }} className="mr-3" />
                        <h1 className="text-[2.9rem] font-logo font-bold hidden custom2:block">Harmony</h1>
                    </div>
                </button>
                <div className="flex justify-center">
                    {(!user.isAdmin) ? null : (<>
                        <button onClick={() => {props.fileAddTrigger(true)}} className="relative group flex flex-col items-center ml-4" >
                            <img src="addUser.png" style={{ width: "2.8rem", height: "auto", objectFit: "contain" }} />
                            <div className="whitespace-nowrap absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                                Add Users
                            </div>
                        </button>
                        <button onClick={() => { props.addTrigger(true)}} className="relative group flex flex-col items-center ml-4" >
                            <img src="add.png" style={{ width: "2.9rem", height: "auto", objectFit: "contain" }} />
                            <div className="whitespace-nowrap absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                                Add Chatroom
                            </div>
                        </button>
                        <button onClick={() => { navigate("/manage") }} className="relative group flex flex-col items-center ml-5">
                            <img src="manager.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }}/>
                            <div className="absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                                Manage
                            </div>
                        </button>
                    </>)}
                    <button onClick={() => { navigate("/logout") }} className="relative group flex flex-col items-center ml-5" >
                        <img src="logout.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }} />
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