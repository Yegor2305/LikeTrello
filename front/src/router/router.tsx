import {createBrowserRouter} from "react-router-dom";
import Template from "../pages/template.tsx";
import Error from "../pages/error.tsx";
import Home from "../pages/home.tsx";
import Auth from "../pages/auth.tsx";
import ProtectedRoute from "../components/protectedRoute.tsx";
import App from "../components/ap.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Template/>,
        errorElement: <Error/>,
        children: [
            {
                index: true,
                element: <ProtectedRoute>
                    {/*<App/>*/}
                        <Home/>
                </ProtectedRoute>

            },
            {
                path: 'auth',
                element: <Auth/>,
            }
        ],
    }
]);