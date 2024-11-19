import './index.css'
import './colors.css'
import {RouterProvider} from "react-router-dom";
import {router} from "./router/router.tsx";
import {getTokenFromLocalStorage} from "./services/localStorageManager.ts";
import {AuthService} from "./services/auth.service.ts";
import {login, logout} from "./store/userSlice.ts";
import {useDispatch} from "react-redux";
import {useEffect} from "react";

function App() {

  const dispatch = useDispatch();

  const checkAuthentication = async () => {
    const token = getTokenFromLocalStorage()
    try {
      if (token){
        const data = await AuthService.getProfile();
        if (data){
          dispatch(login(data))
        }
        else{
          dispatch(logout());
        }
      }
    }
    catch (error) {}
  };

  useEffect(() => {
    checkAuthentication();
  }, [])

  return <RouterProvider router={router}/>
}

export default App
