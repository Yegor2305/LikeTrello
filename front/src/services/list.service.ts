import { instanceAuth } from "../api/axios.api.ts"
import { IList } from '../types/types.ts';

interface UpdateCardProps{
    id: number;
    position: number;
}

interface UpdateCardsInListProps{
    cards: UpdateCardProps[];
}

interface NewCardProps{
    name: string;
}

export const ListService = {
    async addCard(cardProps: NewCardProps, listId: number) : Promise<IList> {
        const {data} = await instanceAuth.post<IList>(`/lists/add-card/${listId}`, cardProps);
        return data;
    },
    async updateListCards(listProps: UpdateCardsInListProps, listId: number) : Promise<any>{
        await instanceAuth.post<boolean>(`/lists/update-list-cards/${listId}`, listProps);
    }
}