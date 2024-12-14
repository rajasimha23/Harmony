import {useNavigate } from "react-router-dom";
import useAuth from "../store/Auth";

function Header () {
    const navigate = useNavigate();
    const {user} = useAuth();

    return <header className="flex flex-row justify-between bg-[#2d2d2d] py-4">
        <button onClick={()=>{navigate("/")}}><h1 className="text-2xl ml-5 md:text-3xl md:ml-7">Chatroom</h1></button>
        {(!user.isAdmin) ? (null) : (<><button onClick={()=>{navigate("/manage")}} ><h1 className="text-2xl ml-5 md:text-3xl md:ml-7">Manage Chatrooms</h1></button></>)}
        <button onClick={()=>{navigate("/logout")}}><h1 className="mr-5 md:mr-7 text-xl">Logout</h1></button>
    </header>
}

export default Header;