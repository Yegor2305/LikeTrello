import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.ts'
import boardReducer from './boardSlice.ts'

export const store = configureStore({
    reducer: {
        user: userReducer,
        board: boardReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch