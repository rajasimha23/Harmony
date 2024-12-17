import {useNavigate } from "react-router-dom";
import useAuth from "../../store/Auth";

function Header () {
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
                    {(!user.isAdmin) ? null : (
                        <button onClick={() => { navigate("/manage") }} className="relative group flex flex-col items-center">
                            <img src="manager4.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }}/>
                            <div className="absolute bottom-[-2.2rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                                Manage
                            </div>
                        </button>
                    )}
                    <button onClick={() => { navigate("/logout") }} className="relative group flex flex-col items-center ml-4" >
                        <img src="logout7.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }} />
                        <div className="absolute bottom-[-2.5rem] opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg px-3 py-1">
                            Logout
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
    
}

export default Header;
// import {useNavigate } from "react-router-dom";
// import useAuth from "../store/Auth";

// function Header () {
//     const navigate = useNavigate();
//     const {user} = useAuth();

//     return (
//         <header className="bg-[#b0dce2] py-4">
//             <div className="mx-5 md:mx-7 flex flex-row justify-center items-center">
//                 <button onClick={() => { navigate("/") }}>
//                     <div className="flex">
//                         <img src="logo.png" style={{ width: "2.5rem", height: "auto", objectFit: "contain" }} className="mr-3" />
//                         <h1 className="text-3xl md:text-3xl w-4/12">Harmony</h1>
//                     </div>
//                 </button>
//                 <div className="flex-1 flex justify-center  w-4/12">
//                     {(!user.isAdmin) ? null : (
//                         <button onClick={() => { navigate("/manage") }}>
//                             <h1 className="text-3xl md:text-3xl">Manage</h1>
//                         </button>
//                     )}
//                 </div>
//                 <button onClick={() => { navigate("/logout") }}>
//                     <h1 className="text-3xl  w-4/12">Logout</h1>
//                 </button>
//             </div>
//         </header>
//     );
    
// }

// export default Header;