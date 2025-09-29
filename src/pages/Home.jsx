import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext.jsx";

export default function Home() {
    const navigate = useNavigate();
    const { authenticated } = useAuthContext();

    useEffect(() => {
        if (authenticated) {
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    }, [authenticated, navigate]);

    return (
        <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
}