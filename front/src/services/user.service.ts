import { instanceAuth } from "../api/axios.api.ts"
import {IList, NewListProps} from "../types/types.ts";

export const UserService = {
    async getLists() : Promise<IList[]> {
        const {data} = await instanceAuth.get<IList[]>("/user/lists");
        return data;
    },
    async addList(listProps: NewListProps) : Promise<IList[]>{
        const {data} = await instanceAuth.post<IList[]>("/user/add-list", listProps);
        return data;
    }
}