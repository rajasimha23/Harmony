import useAuth from "@/store/Auth";
import LINK from "@/store/Link";
const {storeTokenInLS}  = useAuth();

export async function storeData(user:{username: string, email: string, password: string}) {
    const response = await fetch(LINK + "api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }); 
    const resp_data = await response.json();
    if (response.ok) {
        storeTokenInLS(resp_data.token);
    }
    else {
        throw new Error(resp_data.message);
    }
}