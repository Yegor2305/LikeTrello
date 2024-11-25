import { instanceAuth } from "../api/axios.api.ts"
import { IUser } from '../types/types.ts';

interface IUserRegisterData {
    email: string;
    username: string;
    password: string;
}

interface IUserData{
    username: string;
    password: string;
}

export const AuthService = {
    async register(userData : IUserRegisterData) : Promise<IUser> {
        const {data} = await instanceAuth.post<IUser>("/auth/register", userData);
        return data;
    },
    async login(userData : IUserData) : Promise<IUser> {
        const {data} = await instanceAuth.post<IUser>("/auth/login", userData);
        return data;
    },
    async getProfile() : Promise<IUser | undefined> {
        const {data} = await instanceAuth.get<IUser>("/auth/profile");
        if (data) return data;
    },
}