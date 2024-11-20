import {FC, useRef} from "react";
import {CardProps, ItemProps} from "../types/types.ts";
import {useDrag, useDrop} from "react-dnd";
import {useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// const Card : FC<CardProps> = ({card}) => {
//
//     return <div className='card'>
//         {card.name}
//     </div>
// }
//
// export default Card;

export const Item : FC<ItemProps> = ({id, name}) => {
    return <div id={id}>
        {name}
    </div>
}

const Card : FC<CardProps> = ({id, card, index} ) => {

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