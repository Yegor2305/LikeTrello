import {FC, useEffect, useState} from "react";
import {UserService} from "../services/user.service.ts";
import {IList} from "../types/types.ts";
import List from "../components/list.tsx";
import {
    closestCorners,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ListService } from '../services/list.service.ts';

const Home : FC = () => {

    const [lists, setLists] = useState<IList[]>([])
    const [adding, setAdding] = useState<boolean>(false)
    const [listName, setListName] = useState<string>("")
    const [_activeId, setActiveId] = useState<string | null>(null);

    const setStringIds = (data : IList[]) => {
        for (let list of data){
            list.id = `${list.id}`
            for (let card of list.cards){
                card.id = `${card.id}`;
            }
        }
        setLists(data);
    }
    const getLists = async () =>{
        const data = await UserService.getFirstBoardLists();
        if (data){
            setStringIds(data);
        }
    }
    useEffect(() => {
        getLists();
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const findContainer = (id : string)=> {
        const inLists = lists.find((list) => list.id === id);
        // console.log(inLists)
        if (inLists) return inLists;
        // return
        let result : IList | undefined;
        lists.forEach((list) => {
            if (list.cards.find((card) => card.id === id)){
                result = list;
            }
        })
        return result;
    }

    const handleDragStart = (event: any)=> {
        const { active } = event;
        const { id } = active;
        setActiveId(id);
    }

    const handleDragOver = (event: any) => {
        const { active, over, draggingRect } = event;
        const { id } = active;
        const { id: overId } = over;
        // console.log(overId)
        // console.log(event)
        if (!overId) {
            return;
        }

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setLists((prev) => {
            const activeCards = activeContainer.cards;
            const overCards = overContainer.cards;

            const activeIndex = activeCards.findIndex(item => item?.id == id);
            const overIndex = overCards.findIndex(item => item?.id == overId);

            let newIndex;

            if (prev.map((container) => container.id).includes(overId)) {
                newIndex = overCards.length + 1;
            } else {
                const isBelowLastItem =
                    over
                    && overIndex === overCards.length - 1
                    && draggingRect?.offsetTop > over.rect.offsetTop + over.rect.height;
                const modifier = isBelowLastItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overCards.length + 1;
            }

            // console.log(`New index: ${newIndex}`);

            return prev.map((container) => {
                if (container.id === activeContainer.id) {
                    const newCards = container.cards.filter((item) => item?.id !== id)

                    ListService.updateListCards({
                        cards: newCards.map((card, index) => ({
                            id: +card.id,
                            position: index + 1
                        }))
                    }, +container.id)

                    return { ...container,
                        cards: newCards
                    };
                } else if (container.id === overContainer.id) {
                    const newCards = [
                        ...container.cards.slice(0, newIndex),
                        activeCards[activeIndex],
                        ...container.cards.slice(newIndex)];

                    ListService.updateListCards({
                        cards: newCards.map((card, index) => ({
                            id: +card.id,
                            position: index + 1
                        }))
                    }, +container.id)

                    return {
                        ...container, cards: newCards
                    };
                } return container;
            });
            // console.log(newLists)
        })
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        const { id } = active;
        const { id: overId } = over;
        if (!overId) {
            return;
        }

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
          !activeContainer ||
          !overContainer ||
          activeContainer !== overContainer
        ) {
            return;
        }

        const activeIndex = activeContainer.cards.findIndex(item => item?.id == id);
        const overIndex = overContainer.cards.findIndex(item => item?.id == overId);

        if (activeIndex !== overIndex){
            setLists((prev) => {
                return prev.map((list) => {
                    if (list.id === activeContainer.id){
                        const newCards = arrayMove(list.cards, activeIndex, overIndex);
                        ListService.updateListCards({
                            cards: newCards.map((card, index) => ({
                                id: +card.id,
                                position: index + 1
                            }))
                        }, +list.id)
                        return {
                            ...list,
                            cards: newCards
                        }
                    }
                    return list
                })
            })

            setActiveId(null);
        }
    }

    const addListHandler = async () => {
        if (listName.trim() != ""){
            const data = await UserService.addList({name: listName, boardId: lists[0].board.id})
            if (data) {
                getLists()
            }
        }

        setAdding(false);
    }

    const addCard = async (cardName : string, listId : number) => {
        if (cardName.trim() != ""){
            const data: IList = await ListService.addCard({name: cardName}, listId);
            if (data) getLists();
        }
    }

    return <div className='flex flex-x lists-container'>

        <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}>

            {
                lists.map((list) => (
                    <List key={list.id} list={list} addCard={addCard}/>
                ))
            }
            {/*<DragOverlay>{activeId ? <div className='card'></div> : null}</DragOverlay>*/}
        </DndContext>

        {
            adding ? (
                <form className='flex'>
                    <input type='text' className='add-list-input card'
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    onBlur={() => addListHandler()}/>
                </form>
            ) : (
                <div className='flex list pointer items-center justify-center' onClick={() => setAdding(true)}>
                    + Add List
                </div>
            )
        }
    </div>
}

export default Home;