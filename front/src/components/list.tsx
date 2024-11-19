import {FC, useState} from "react";
import {IList, ListProps} from "../types/types.ts";
import Card from "./card.tsx";
import {ListService} from "../services/list.service.ts";

const List : FC<ListProps> = ({list}) => {

    const [sList, setSList] = useState<IList>(list)
    const [adding, setAdding] = useState<boolean>(false);
    const [cardName, setCardName] = useState<string>("")

    const addCardHandler = async () => {
        if (cardName.trim() != ""){
            const data:IList = await ListService.addCard({name: cardName}, list.id);

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
            {
                sList.cards.map((card) => (
                    <Card key={card.id} card={card}/>
                ))

            }
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