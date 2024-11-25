import { instanceAuth } from "../api/axios.api.ts"
import { IBoard } from '../types/types.ts';

interface EmailSendingProps{
	email: string;
	boardId: number;
}

interface NewListProps{
	name: string;
	boardId: number;
}

interface ISharedBoards{
	id: number;
	board: IBoard;
}

interface ConfirmBoardSharingResult{
	success: boolean;
	message: string;
}

export const UserService = {
	async getBoard(boardId: number) : Promise<IBoard> {
		const {data} = await instanceAuth.get<IBoard>(`/user/board/${boardId}`);
		return data;
	},

	async getFirstBoardLists() : Promise<IBoard> {
		const {data} = await instanceAuth.get<IBoard>("/user/first-board-lists");
		return data;
	},

	async getBoards() : Promise<IBoard[]> {
		const {data} = await instanceAuth.get<IBoard[]>("user/boards");
		return data;
	},

	async getSharedBoards() : Promise<IBoard[]> {
		const {data} = await instanceAuth.get<ISharedBoards[]>("user/shared-boards");
		return data.map((shared) => { return shared.board });
	},

	async addList(listProps: NewListProps) : Promise<boolean>{
		const {data} = await instanceAuth.post<boolean>("/user/add-list", listProps);
		return data;
	},

	async sendSharingEmail(props: EmailSendingProps): Promise<void> {
		await instanceAuth.post<void>(`/user/send-email`, props)
	},

	async confirmBoardSharing(token: string) : Promise<ConfirmBoardSharingResult> {
		const {data} = await instanceAuth.get<ConfirmBoardSharingResult>(`/user/share-board-confirm?token=${token}`);
		return data;
	}
}