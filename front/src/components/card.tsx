import {FC} from "react";
import { ICard } from '../types/types.ts';
import {useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ItemProps{
    id: string;
    name: string;
}

export const Item : FC<ItemProps> = ({id, name}) => {
    return <div id={id}>
        {name}
    </div>
}

interface CardProps{
    id: string;
    card: ICard;
}

const Card : FC<CardProps> = ({id, card} ) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };


    return (
        <div className='card' style={style} ref={setNodeRef} {...attributes} {...listeners} >
            <Item id={id} name={card.name}/>
        </div>
    )
}

export default Card;