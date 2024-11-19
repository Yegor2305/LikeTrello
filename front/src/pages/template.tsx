import {FC} from "react";
import {Outlet} from "react-router-dom";
import Header from "../components/header.tsx";

const Template : FC = () => {
    return <div className='content'>
        <Header/>
        <div className='container'>
            <Outlet/>
        </div>
    </div>
}

export default Template;