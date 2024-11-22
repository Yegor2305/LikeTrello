import {createBrowserRouter} from "react-router-dom";
import Template from "../pages/template.tsx";
import Error from "../pages/error.tsx";
import Auth from "../pages/auth.tsx";
import ProtectedRoute from "../components/protected-route.tsx";
import Menu from '../components/menu.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Template/>,
        errorElement: <Error/>,
        children: [
            {
                index: true,
                element: <ProtectedRoute>
                    <Menu forPage={'home'}/>
                </ProtectedRoute>

            },
            {
                path: 'shared',
                element: <ProtectedRoute>
                    <Menu forPage={'shared'}/>
                </ProtectedRoute>
            },
            {
                path: 'login',
                element: <Auth isLogin={true}/>,
            },
            {
                path: 'register',
                element: <Auth isLogin={false}/>
            }
        ],
    }
]);