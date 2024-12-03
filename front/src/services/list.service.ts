import { instanceAuth } from "../api/axios.api.ts"
import { IList } from '../types/types.ts';

interface UpdatePositionProps{
    id: number;
    position: number;
}

interface UpdateCardsInListProps{
    cards: UpdatePositionProps[];
}

interface UpdateListsPositionProps{
    lists: UpdatePositionProps[];
}

interface NewCardProps{
    name: string;
}

export const ListService = {
    async addCard(cardProps: NewCardProps, listId: number) {
        await instanceAuth.post<IList>(`/lists/add-card/${listId}`, cardProps);
    },
    async updateListCards(listProps: UpdateCardsInListProps, listId: number) : Promise<any>{
        await instanceAuth.post<boolean>(`/lists/update-list-cards/${listId}`, listProps);
    },

    async updateListsPosition(listPositionProps: UpdateListsPositionProps){
        await instanceAuth.post('lists/update-lists-position', listPositionProps);
    }
}