export interface IUser{
    id: number;
    username: string;
    access_token: string;
}

export interface IUserData{
    username: string;
    password: string;
}

export interface ICard{
    id: string;
    name: string;
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
}

export interface CardProps{
    id: string;
    card: ICard;
    index: number;
    // moveCard: (dragIndex : number, hoverIndex : number) => void;
}

export interface CardObject{
    card: ICard;
    list: IList;
    index: number;
    moveCard: (dragIndex : number, hoverIndex : number) => void;
}

export interface NewCardProps{
    name: string;
}

export interface NewListProps{
    name: string;
}

export interface ItemProps{
    id: string;
    name: string;
}