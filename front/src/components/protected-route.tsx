import {FC} from "react";
import Auth from "../pages/auth.tsx";
import {useAuth} from "../store/hooks.ts";

interface Props {
    children: JSX.Element;
}

const ProtectedRoute : FC<Props> = ({ children }) => {

    const isAuth = useAuth()
    return <>
        {
            isAuth ? children : <Auth isLogin={true}/>
        }
    </>
}

export default ProtectedRoute;