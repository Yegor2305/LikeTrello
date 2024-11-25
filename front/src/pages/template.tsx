import {FC} from "react";
import {Outlet} from "react-router-dom";
import Header from "../components/header.tsx";
import { ToastContainer } from 'react-toastify';

const Template : FC = () => {

    return <div className='content'>
        <Header/>
        <div className='container'>
            <Outlet/>
            <ToastContainer position='bottom-right'/>
        </div>
    </div>
}

export default Template;