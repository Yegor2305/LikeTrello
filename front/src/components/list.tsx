import {FC, useState} from "react";
import {IList, ListProps} from "../types/types.ts";
import Card from "./card.tsx";
import {ListService} from "../services/list.service.ts";

import {
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";


const List : FC<ListProps> = ({list}) => {

    const [sList, setSList] = useState<IList>(list)
    const [adding, setAdding] = useState<boolean>(false);
    const [cardName, setCardName] = useState<string>("")

    const id = list.id;
    const {setNodeRef} = useDroppable({
        id
    })


    const addCardHandler = async () => {
        if (cardName.trim() != ""){
            const data:IList = await ListService.addCard({name: cardName}, +list.id);

            if (data){
                setSList(data);
            }
        }
        setAdding(false);
    }

    return <div className='list flex flex-y'>
        <div className='header flex flex-x flex-between'>
            <div className='list-name'>{list.name}</div>
        </div>

            <div className='list-content flex flex-y'>
                <SortableContext id={id} items={list.cards}  strategy={verticalListSortingStrategy}>
                    <div ref={setNodeRef}>
                        {
                            list.cards.map((card, index) => (
                                <Card key={index} id={`${card.id}`} card={card} index={index}/>
                            ))
                        }
                    </div>
                </SortableContext>
                {
                    adding ? (
                        <form className='flex'>
                        <textarea className='card'
                                  onBlur={() => addCardHandler()}
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value)}>
                        </textarea>
                        </form>
                    ) : (
                        <div className='card' onClick={() => setAdding(true)}>
                            + Add card
                        </div>
                    )
                }
            </div>

    </div>
}

export default List;