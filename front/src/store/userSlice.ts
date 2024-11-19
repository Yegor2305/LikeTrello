import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type { RootState } from './store'
import {IUser} from "../types/types.ts";

interface IUserState {
    user : IUser | null,
    isAuthenticated: boolean,
}

const initialState: IUserState = {
    user: null,
    isAuthenticated: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action : PayloadAction<IUser>) => {
            state.user = action.payload
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
        },
    },
})

export const { login, logout } = userSlice.actions

export const selectCount = (state: RootState) => state.user

export default userSlice.reducer