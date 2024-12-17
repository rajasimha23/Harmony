import RotateLoader from "react-spinners/RotateLoader";

function Loader() {
    const serverMessage = "The Server Can Take Upto 90 Seconds Due To Inactivity";
    return <div className="mx-5 text-center"><div className="w-full h-90vh flex flex-col justify-center items-center"><RotateLoader color="#000000" margin={12} size={25} /><h2 className="text-2xl mb-2 mt-8">{serverMessage}</h2></div></div>;
    
}

export default Loader;