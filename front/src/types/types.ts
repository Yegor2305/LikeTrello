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
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IList{
    id: number;
    name: string;
    cards: ICard[];
}

export interface ListProps{
    list: IList;
}

export interface CardProps{
    card: ICard;
}

export interface NewCardProps{
    name: string;
}

export interface NewListProps{
    name: string;
}