import { instanceAuth } from "../api/axios.api.ts"
import { IList, NewListProps } from '../types/types.ts';

export const UserService = {
    async getFirstBoardLists() : Promise<IList[]> {
        const {data} = await instanceAuth.get<IList[]>("/user/first-board-lists");
        return data;
    },
    async addList(listProps: NewListProps) : Promise<boolean>{
        const {data} = await instanceAuth.post<boolean>("/user/add-list", listProps);
        return data;
    },
}