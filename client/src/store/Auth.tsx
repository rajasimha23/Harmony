import React, { useState } from "react";
import LINK from "./Link";
import Loader from "../components/Loader";
import TOKENNAME from "./Token";
import DummyHeader from "../components/headers/DummyHeader";

export type UserType = {
    email:string,
    isAdmin:boolean,
    joinedOn:Date,
    userId:number,
    username:string,
    _id:string
}


interface AuthContextType {
    isLoggedIn: boolean;
    storeTokenInLS: (serverToken: string) => void;
    LogoutUser: () => void;
    user: UserType;
    setLastPage: (x:string)=>void;
    lastPage: string;
}

export const AuthContext = React.createContext<AuthContextType|null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setLoading] = React.useState(false);
    const[token, setToken] = React.useState(localStorage.getItem(TOKENNAME));
    const [lastPage, setLastPage] = useState("/home");
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [user, setUser] = React.useState<UserType>({
        email: "",
        isAdmin: false,
        joinedOn: new Date(),
        userId: 0,
        username: "",
        _id: "",
    });

    const storeTokenInLS = (serverToken: string) => {
        setToken(serverToken);
        return localStorage.setItem(TOKENNAME, serverToken);
    };

    const LogoutUser = () => {
        setToken("");
        setLoggedIn(false);
        return localStorage.removeItem(TOKENNAME);
    };

    const userAuthentication = async () => {
        try {
            setLoading(true);
            const response = await fetch(LINK + "api/auth/user", {
                method: "GET",
                headers: {
                    Authorization: `${token}`,
                }
            });
            setLoading(false);
            if (response.ok) {
                const data = await response.json();
                const userData = data.message;
                setUser(userData);
                setLoggedIn(true);
            }
        }
        catch (err) {
            console.log("Error Fetching User Data");
            setLoading(false);
        }
    }

    React.useEffect(() => {
        userAuthentication();
    }, [token]);
    
    return (<AuthContext.Provider value={{isLoggedIn, storeTokenInLS, LogoutUser, user, setLastPage, lastPage}}>
        {isLoading?<><DummyHeader /><Loader /></> :children}
    </AuthContext.Provider>);
};

export const useAuth = () => {
    const authContextValue = React.useContext(AuthContext);
    if (!authContextValue) {
      throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
};

export default useAuth;