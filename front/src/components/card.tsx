import { FC, MutableRefObject, useRef, useState } from 'react';
import { ICard, IList } from '../types/types.ts';
import {useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Modal from 'react-modal';
import { MdEdit } from 'react-icons/md';
import EditCardModal from './modals/edit-card-modal.tsx';

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
    list: IList;
}

const modalStyle = {
    content: {
        // position: 'absolute',
        backgroundColor: 'transparent',
        border: 'none',
        top: '0',
        left: '25%',
        right: 'auto',
        bottom: 'auto',
        // height: '100%',
        width: '50%',
        padding: '6px',
        // transform: 'translate(-50%)',
        overflow: 'hidden',
        // margin: '50px 0',
    },
    overlay: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
        // paddingTop: '100px',
        // paddingBottom: '100px',
        // padding: '200px 0'
    }
};

const Card : FC<CardProps> = ({id, card, list} ) => {

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [hovered, setHovered] = useState<boolean>(false);
    const hoverTimeout:MutableRefObject<any> = useRef()

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

    const mouseEnterHandler = () => {
        hoverTimeout.current = setTimeout(()=> {
            setHovered(true)
        }, 500)
    }

    const mouseLeaveHandler = () => {
        clearTimeout(hoverTimeout.current)
        setHovered(false)
    }


    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={modalStyle}
                shouldCloseOnEsc={true}
            >
                <EditCardModal card={card} list={list}/>
            </Modal>

            <div className='card'  style={style}
                 ref={setNodeRef} {...attributes} {...listeners}
                 onMouseEnter={mouseEnterHandler}
                 onMouseLeave={mouseLeaveHandler}
                 onMouseDown={() => {
                     if (hovered) setModalIsOpen(true);
                 }}
            >
                <Item id={id} name={card.name} />
                {
                    hovered && (
                        <div className='ml-auto'>
                            <MdEdit/>
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Card;