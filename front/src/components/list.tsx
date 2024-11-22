import {FC, useState} from "react";
import {ListProps} from "../types/types.ts";
import Card from "./card.tsx";

import {
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";

const containerStyle = {
    paddingBottom: "6px",
    paddingTop: "6px",
    gap: 4,
};

const List : FC<ListProps> = ({list, addCard, shared}) => {

    const [adding, setAdding] = useState<boolean>(false);
    const [cardName, setCardName] = useState<string>("")

    const id = list.id;
    const {setNodeRef} = useDroppable({
        id
    })

    const addCardHandler = async () => {
        addCard(cardName, +list.id);
        setAdding(false);
        setCardName('');
    }

    return <div className='list flex flex-y'>
        <div className='header flex flex-x flex-between'>
            <div className='list-name'>{list.name}</div>
        </div>

            <div className='flex flex-y flex-end flex-1' style={containerStyle}>
                {
                    list.cards.length > 0 && (
                        <SortableContext id={id} items={list.cards} strategy={verticalListSortingStrategy}>
                            <div ref={setNodeRef} className='list-content flex flex-y'>
                                {
                                    list.cards.map((card) => (
                                        <Card key={card.id} id={`${card.id}`} card={card} />
                                    ))
                                }
                            </div>
                            </SortableContext>
                    )
                }
                {
                    adding && (
                        <form className='flex'>
                        <textarea className='card'
                                  onBlur={() => addCardHandler()}
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value)}>
                        </textarea>
                        </form>
                    )
                }
                {
                    (!adding && !shared) &&(
                        <div className='card' onClick={() => setAdding(true)}>
                            + Add card
                        </div>
                    )
                }
            </div>

    </div>
}

export default List;