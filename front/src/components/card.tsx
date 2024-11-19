import {FC} from "react";
import {CardProps} from "../types/types.ts";

const Card : FC<CardProps> = ({card}) => {

    return <div className='card'>
        {card.name}
    </div>
}

export default Card;