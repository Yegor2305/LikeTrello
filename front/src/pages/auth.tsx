import {FC, useState} from "react";
import * as React from "react";
import {useAppDispatch} from "../store/hooks.ts";
import {useNavigate} from "react-router-dom";
import {IUser} from "../types/types.ts";
import {login} from "../store/userSlice.ts";
import {setTokenToLocalStorage} from "../services/localStorageManager.ts";
import {AuthService} from "../services/auth.service.ts";

const Auth : FC = () => {

    const [isLogin, setIsLogin] = useState<boolean>(true)
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [repeatPassword, setRepeatPassword] = useState<string>('')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const log_in = (data : IUser) => {
        if (data){
            setTokenToLocalStorage(data.access_token)
            dispatch(login(data))
            navigate("/")
        }
    }

    const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const data = await AuthService.login({username, password});
            log_in(data);
        }catch (error : any){
            console.log((error.response?.data.message).toString());
        }
    }

    const registrationHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            if (password === repeatPassword){
                const data = await AuthService.register({username, password});
                log_in(data);
            }

        }catch (error : any){
            console.log((error.response?.data.message).toString());
        }
    }

    return <div className='flex flex-y justify-center items-center to-center'>
        <h1 className='to-center color-first mt-20'>
            {isLogin ? 'Login' : 'Registration'}
        </h1>
        <form className='form-default' onSubmit={isLogin ? loginHandler : registrationHandler}>
            <input
                type='text'
                placeholder='Username'
                onChange={(e) => setUsername(e.target.value)}/>
            <input
                type='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}/>
            {
                !isLogin && (
                    <input type='password'
                           placeholder='Repeat password'
                           onChange={(e) => setRepeatPassword(e.target.value)}/>
                )
            }
            <button className='btn pad-x-20'>{isLogin ? 'Log in' : 'Sign Up'}</button>

        </form>
        {
            isLogin ? (
                <button className='btn-text mt-20px' onClick={() => setIsLogin(!isLogin)}>Don't have an
                    account?</button>
            ) : (
                <button className='btn-text mt-20px' onClick={() => setIsLogin(!isLogin)}>Already have an
                    account?</button>
            )
        }
    </div>
}

export default Auth;