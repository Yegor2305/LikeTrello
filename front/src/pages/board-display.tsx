import { FC, useEffect, useState } from "react";
import { UserService } from "../services/user.service.ts";
import { IBoard, IList, SharedProp } from '../types/types.ts';
import List from "../components/list.tsx";
import Modal from 'react-modal';
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
import ShareBoardModal from '../components/modals/share-board-modal.tsx';
import { toast } from 'react-toastify';

interface BoardDisplayProps extends SharedProp{
    boardToDisplay: IBoard;
}

Modal.setAppElement('#root');

export const BoardDisplay: FC<BoardDisplayProps> = ({ boardToDisplay, shared }) => {

    const [board, setBoard] = useState<IBoard>(boardToDisplay);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [adding, setAdding] = useState<boolean>(false)
    const [listName, setListName] = useState<string>("")
    const [_activeId, setActiveId] = useState<string | null>(null);

    const modalStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            width: '50%',
            height: '50%',
            padding: '6px',
            transform: 'translate(-50%, -50%)',
        },
    };

    const setStringIds = (data: IBoard) => {
        for (let list of data.lists) {
            list.id = `${list.id}`
            for (let card of list.cards) {
                card.id = `${card.id}`;
            }
            list.cards.sort((a, b) => {
                return a.position - b.position;
            })
        }
        setBoard(data);
    }

    const getLists = async () => {
        const data = await UserService.getBoard(board.id);
        if (data) {
            setStringIds(data);
        }
    }

    useEffect(() => {
        setStringIds(boardToDisplay);
    }, [boardToDisplay]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const findContainer = (id: string) => {
        const inLists = board.lists.find((list) => list.id === id);
        if (inLists) return inLists;
        let result: IList | undefined;
        board.lists.forEach((list) => {
            if (list.cards.find((card) => card.id === id)) {
                result = list;
            }
        })
        return result;
    }

    const handleDragStart = (event: any) => {
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

        setBoard((prev) => {
            const activeCards = activeContainer.cards;
            const overCards = overContainer.cards;

            const activeIndex = activeCards.findIndex(item => item?.id == id);
            const overIndex = overCards.findIndex(item => item?.id == overId);

            let newIndex;

            if (prev.lists.map((container) => container.id).includes(overId)) {
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

            return {
                ...prev, lists: prev.lists.map((container) => {
                    if (container.id === activeContainer.id) {
                        const newCards = container.cards.filter((item) => item?.id !== id)

                        ListService.updateListCards({
                            cards: newCards.map((card, index) => ({
                                id: +card.id,
                                position: index + 1
                            }))
                        }, +container.id)

                        return {
                            ...container,
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
                    }
                    return container;
                })
            }
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

        if (activeIndex !== overIndex) {
            setBoard((prev) => {
                return {
                    ...prev, lists: prev.lists.map((list) => {
                        if (list.id === activeContainer.id) {
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
                }
            })

            setActiveId(null);
        }
    }

    const addListHandler = async () => {
        console.log(listName)
        if (listName.trim() != "") {
            const data = await UserService.addList({ name: listName, boardId: board?.id })
            if (data) {
                getLists()
            }
        }

        setAdding(false);
        setListName('');
    }

    const addCard = async (cardName: string, listId: number) => {
        if (cardName.trim() != "") {
            const data: IList = await ListService.addCard({ name: cardName }, listId);
            if (data) getLists();
        }
    }

    const shareBoard = async (email : string) => {
        if (email.trim() !== ''){
            try {
                await UserService.sendSharingEmail({ email: email, boardId: board.id });
                toast.success('Sent');
            }catch (error : any){
                toast.error((error.response?.data.message).toString());
            }
            setModalIsOpen(false);
        }
    }

    return <div className='board-display'>
        {
            !shared && (
                <button className='share-board-button' onClick={() => setModalIsOpen(true)}>Share board</button>
            )
        }
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            style={modalStyle}>
            <ShareBoardModal onSubmit={shareBoard}/>
        </Modal>
        <div className='flex flex-x lists-container'>
            {
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}>
                    {
                        board.lists.map((list) => (
                            <List key={list.id} list={list} addCard={addCard} shared={shared} />
                        ))
                    }
                    {/*<DragOverlay>{_activeId ? <div className='card'></div> : null}</DragOverlay>*/}
                </DndContext>
            }

            {
                adding && (
                    <form className='flex' onSubmit={addListHandler}>
                        <input type='text' className='add-list-input card'
                               value={listName}
                               onChange={(e) => setListName(e.target.value)}
                               onBlur={() => addListHandler()}
                               autoFocus={true}
                        />
                    </form>
                )
            }
            {
                (!adding && !shared) && (
                    <div className='flex list pointer items-center justify-center text-align-center' onClick={() => setAdding(true)}>
                        + Add List
                    </div>
                )
            }
        </div>
    </div>
}

// export default BoardDisplay;