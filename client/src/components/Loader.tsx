import RotateLoader from "react-spinners/RotateLoader";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function Loader() {
    const serverMessage = "The Server Can Take Upto 90 Seconds Due To Inactivity";
    return <div className="w-full h-80vh flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
            <DotLottieReact
                // src="https://lottie.host/76e824a9-65d6-4f70-8932-e7176d46ca9f/PxHfrIcYUt.json"
                // src="https://lottie.host/a8e676dd-22b5-47ef-8472-2e1072cc5ea1/QWiqAxI0vm.json"
                // src="https://lottie.host/62a4c118-52f9-4dd3-8052-1b27216448e6/nTh20QwCcE.lottie"
                src="https://lottie.host/08b99ebc-82d2-437d-9a1c-3143b14aabe2/6gGInrVoj9.json" 
                loop
                style={{width:500, height: 500}}
                autoplay
                speed={1.1}
                />
            {/* <RotateLoader color="#000000" margin={12} size={25} /> */}
            <h2 className="text-3xl font-bold">{serverMessage}</h2>
        </div>
    </div>;
    
}

export default Loader;