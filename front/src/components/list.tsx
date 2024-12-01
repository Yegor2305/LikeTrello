import {FC, useState} from "react";
import { IList, SharedProp } from '../types/types.ts';
import Card from "./card.tsx";
import {
    SortableContext,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {useDroppable} from "@dnd-kit/core";
import { CgAdd } from 'react-icons/cg';

const containerStyle = {
    paddingBottom: "6px",
    paddingTop: "6px",
    gap: 4,
};

interface ListProps extends SharedProp{
    list: IList;
    addCard: (cardName: string, listId: number) => Promise<void>;
}

const List : FC<ListProps> = ({list, addCard, shared}) => {

    const [adding, setAdding] = useState<boolean>(false);
    const [cardName, setCardName] = useState<string>("")

    const id = list.id;
    const {setNodeRef} = useDroppable({
        id
    })

    const addCardHandler = async () => {
        await addCard(cardName, +list.id);
        setAdding(false);
        setCardName('');
    }

    return <div className='list flex flex-y'>
        <div className='header flex flex-x flex-between'>
            <div className='list-name'>{list.name}</div>
        </div>

            <div className='flex flex-y flex-end flex-1' style={containerStyle}>
                {
                    <SortableContext id={id} items={list.cards} strategy={verticalListSortingStrategy}>

                        <div ref={setNodeRef} className={list.cards.length > 0 ? 'list-content' : 'pad-0'}>
                        {
                            list.cards.map((card) => (
                                <Card key={card.id} id={`${card.id}`} card={card} list={list} />
                            ))
                        }
                        </div>

                    </SortableContext>
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
                        <div className='flex flex-x items-center justify-center card text-align-center' onClick={() => setAdding(true)}>
                            <CgAdd/> &nbsp; Add card
                        </div>
                    )
                }
            </div>

    </div>
}

export default List;