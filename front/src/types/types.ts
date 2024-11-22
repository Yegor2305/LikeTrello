export interface IUser{
    id: number;
    username: string;
    access_token: string;
}

export interface IUserRegisterData {
    email: string;
    username: string;
    password: string;
}

export interface IUserData{
    username: string;
    password: string;
}

export interface IBoard{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    lists: IList[];
}

export interface ICard{
    id: string;
    name: string;
    position: number;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IList{
    id: string;
    name: string;
    cards: ICard[];
}

export interface ListProps{
    list: IList;
    addCard: (cardName: string, listId: number) => Promise<void>;
}

export interface CardProps{
    id: string;
    card: ICard;
}

export interface NewCardProps{
    name: string;
}

export interface NewListProps{
    name: string;
    boardId: number;
}

export interface ItemProps{
    id: string;
    name: string;
}

export interface UpdateCardProps{
    id: number;
    position: number;
}

export interface UpdateCardsInListProps{
    cards: UpdateCardProps[];
}