import { useState} from "react";
import useAuth from "../store/Auth";
import Loader from "../components/Loader";

function Home() {
    const {user}:any = useAuth();
    const displayName:string = `, ${user.username}`;
    const userID:any = user._id;
    console.log(typeof userID)
    const [isLoading, setLoading] = useState(false);

    return <>
        {isLoading ?<Loader /> : 
            (<div className="mx-5"><div className="flex flex-col justify-center items-center w-full h-90vh">
                <h1 className="mb-5 text-4xl md:text-5xl text-center">Welcome{displayName}</h1>
            </div></div> )}
    </>
}   

export default Home;