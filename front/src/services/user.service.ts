import { instanceAuth } from "../api/axios.api.ts"
import { IBoard, NewListProps } from '../types/types.ts';

export const UserService = {
    async getFirstBoardLists() : Promise<IBoard> {
        const {data} = await instanceAuth.get<IBoard>("/user/first-board-lists");
        return data;
    },
    async addList(listProps: NewListProps) : Promise<boolean>{
        const {data} = await instanceAuth.post<boolean>("/user/add-list", listProps);
        return data;
    },
}