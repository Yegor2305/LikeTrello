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
    useSensors
} from "@dnd-kit/core";
import {sortableKeyboardCoordinates} from "@dnd-kit/sortable";

const Home : FC = () => {

    const [lists, setLists] = useState<IList[]>([])
    const [adding, setAdding] = useState<boolean>(false)
    const [listName, setListName] = useState<string>("")
    const [activeId, setActiveId] = useState();

    useEffect(() => {
        const getLists = async () =>{
            const data = await UserService.getLists();
            if (data){
                for (let list of data){
                    list.id = `${list.id}`
                    for (let card of list.cards){
                        card.id = `${card.id}`;
                    }
                }
                setLists(data);
            }
        }
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
        console.log(inLists)
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
        console.log(event)
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

            console.log(`New index: ${newIndex}`);

            const newLists = prev.map((container) => {
                if (container.id === activeContainer.id) {
                    return { ...container,
                        cards: container.cards.filter((item) => item?.id !== id)
                    };
                } else if (container.id === overContainer.id) {
                    const updatedItems = [
                        ...container.cards.slice(0, newIndex),
                        activeCards[activeIndex],
                        ...container.cards.slice(newIndex)];
                    return {
                        ...container, cards: updatedItems
                    };
                } return container;
            });
            console.log(newLists)
            return newLists
        })
    }

    const addListHandler = async () => {
        if (listName.trim() != ""){
            const data = await UserService.addList({name: listName})
            if (data) {
                setLists(data)
            }
        }

        setAdding(false);
    }

    return <div className='flex flex-x lists-container'>

        <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        collisionDetection={closestCorners}>

            {
                lists.map((list) => (
                    <List key={list.id} list={list}/>
                ))
            }
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