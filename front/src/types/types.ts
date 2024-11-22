export interface IUser{
    id: number;
    username: string;
    access_token: string;
}

export interface IUsername{
    username: string;
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
    user?: IUsername; // just username
    createdAt: Date;
    updatedAt: Date;
    lists: IList[];
}

export interface ISharedBoards{
    id: number;
    board: IBoard;
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

export interface SharedProp{
    shared: boolean;
}

export interface ListProps extends SharedProp{
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

export type Pages = 'home' | 'shared';

export interface MenuProps{
    forPage: Pages;
}

export interface BoardDisplayProps extends SharedProp{
    boardToDisplay: IBoard;
}

export interface EmailSendingProps{
    email: string;
    boardId: number;
}

export interface ShareModalProps{
    boardId: number;
}