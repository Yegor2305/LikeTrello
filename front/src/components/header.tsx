import {FC} from "react";
import {removeTokenFromLocalStorage} from "../services/localStorageManager.ts";
import {logout} from "../store/userSlice.ts";
import {Link, NavLink, useNavigate} from "react-router-dom";
import {useAppDispatch, useAuth} from "../store/hooks.ts";

const Header : FC = () => {

    const isAuth = useAuth();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());
        removeTokenFromLocalStorage();
        navigate('/auth');
    }

    return <header>
        {
            isAuth && (
                <nav className='to-right pad-x-20'>
                    <ul className='navigation'>
                        <li className='navigation-item'>
                            <NavLink to='/'
                            className={({isActive}) => isActive ? 'text-navigation-active' : 'text-navigation-common'}>
                            Home</NavLink>
                        </li>
                        <li className='navigation-item'>
                            <NavLink to='shared'
                            className={({isActive}) => isActive ? 'text-navigation-active' : 'text-navigation-common'}>
                            Shared</NavLink>
                        </li>
                    </ul>
                </nav>
            )
        }
        {
            isAuth ? (
                <button className='btn y-center' onClick={logoutHandler}>
                    <span>Log out</span>
                </button>
            ) : (
                <Link className='to-right a-default text-navigation-common' to='login'>
                    Log in | Sign Up
                </Link>
            )

        }
    </header>
}

export default Header;