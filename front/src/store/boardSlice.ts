import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store.ts';

interface IBoardState {
	shared: boolean;
}

const initialState: IBoardState = {
	shared: false,
}

export const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		setShared: (state,  action : PayloadAction<boolean>) => {
			state.shared = action.payload;
		}
	},
})

export const { setShared } = boardSlice.actions

export const selectCount = (state: RootState) => state.board

export default boardSlice.reducer