import { Button } from "../ui";
import Lottie from "lottie-react";
import { useRef } from "react";
import googleLogo from "../../assets/icons/googleLogo.json";

const GoogleButton = ({ onClick }) => {
    const lottieRef = useRef();

    const handleMouseEnter = () => {
        lottieRef.current?.play();
    };

    const handleMouseLeave = () => {
        lottieRef.current?.stop();
    };

    return (
        <Button
            type="button"
            variant="secondary"
            className="w-full gap-3"
            onClick={onClick}
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
            <span className="font-bold">Sign up with Google</span>
        </Button>
    );
};

export default GoogleButton;
