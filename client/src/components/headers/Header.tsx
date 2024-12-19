import {useNavigate } from "react-router-dom";
import useAuth from "../../store/Auth";
import img1 from "../../../public/logo.png";
import img2 from "../../../public/manager.png";
import img3 from "../../../public/logout.png";

function Header () {
    const navigate = useNavigate();
    const {user} = useAuth();

    return (
        <header className="py-4 customHeader">
            <div className="mx-2 md:mx-6 flex flex-row justify-between items-center">
                <button onClick={() => { navigate("/") }}>
                    <div className="flex ml-2">
                        <img src={img1} style={{ width: "2.5rem", height: "auto", objectFit: "contain" }} className="mr-3" />
                        <h1 className="text-[2.9rem] font-logo font-bold">Harmony</h1>
                    </div>
                </button>
                <div className="flex justify-center">
                    {(!user.isAdmin) ? null : (<>
                        <button onClick={() => { navigate("/manage") }} className="relative group flex flex-col items-center ml-5">
                            <img src={img2} style={{ width: "3rem", height: "auto", objectFit: "contain" }}/>
                            <div className="absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                                Manage
                            </div>
                        </button>
                    </>)}
                    <button onClick={() => { navigate("/logout") }} className="relative group flex flex-col items-center ml-5" >
                        <img src={img3} style={{ width: "3rem", height: "auto", objectFit: "contain" }} />
                        <div className="absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                            Logout
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );   
}

export default Header;

