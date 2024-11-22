import { instanceAuth } from "../api/axios.api.ts"
import { EmailSendingProps, IBoard, ISharedBoards, NewListProps } from '../types/types.ts';

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
	}
}