import { Button } from "../ui";
import Lottie from "lottie-react";
import { useRef } from "react";
import googleLogo from "../../assets/icons/googleLogo.json";

import { BASE_URL } from "../../lib/utils";

const GoogleButton = ({ text = "Continue with Google" }) => {
    const lottieRef = useRef();

    const handleMouseEnter = () => {
        lottieRef.current?.play();
    };

    const handleMouseLeave = () => {
        lottieRef.current?.stop();
    };

    const handleGoogleAuth = () => {
        // Redirect to Backend Google Auth Endpoint
        window.location.href = `${BASE_URL}/api/v1/jinraiForm/auth/google`;
    };

    return (
        <Button
            type="button"
            variant="secondary"
            className="w-full gap-3"
            onClick={handleGoogleAuth}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="w-6 h-6">
                <Lottie
                    lottieRef={lottieRef}
                    animationData={googleLogo}
                    loop={false}
                    autoplay={true}
                />
            </div>
            <span className="font-bold">{text}</span>
        </Button>
    );
};

export default GoogleButton;
