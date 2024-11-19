import axios from "axios";
import {getTokenFromLocalStorage} from "../services/localStorageManager.ts";

export const instanceAuth = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        Authorization: 'Bearer ' + getTokenFromLocalStorage(),
    }
})

export const instanceGeneral = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`,
    headers: {}
})