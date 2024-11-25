import {createBrowserRouter} from "react-router-dom";
import Template from "../pages/template.tsx";
import Error from "../pages/error.tsx";
import Auth from "../pages/auth.tsx";
import ProtectedRoute from "../components/protected-route.tsx";
import Menu from '../components/menu.tsx';
import ConfirmSharing from '../components/confirm-sharing.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Template/>,
        errorElement: <Error/>,
        children: [
            {
                index: true,
                element: <ProtectedRoute>
                    <Menu/>
                </ProtectedRoute>

            },
            {
                path: 'confirm-board-sharing/:token',
                element: <ConfirmSharing/>

            },
            {
                path: 'auth',
                element: <Auth/>,
            },
        ],
    }
]);