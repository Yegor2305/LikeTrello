export interface IUser{
    id: number;
    username: string;
    access_token: string;
}

export interface IUsername{
    username: string;
}

export interface IBoard{
    id: number;
    name: string;
    user?: IUsername; // just username
    createdAt: Date;
    updatedAt: Date;
    lists: IList[];
}

export interface ICard{
    id: string;
    name: string;
    position: number;
    description: string;
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

export type Pages = 'home' | 'shared';
