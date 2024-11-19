import { instanceAuth } from "../api/axios.api.ts"
import {IList, NewCardProps} from "../types/types.ts";

export const ListService = {
    async addCard(cardProps: NewCardProps, listId: number) : Promise<IList> {
        const {data} = await instanceAuth.post<IList>(`/lists/add-card/${listId}`, cardProps);
        return data;
    },
}