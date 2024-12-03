import { FC, useState } from 'react';
import { ICard, IList } from '../../types/types.ts';
import { IoMdCard } from 'react-icons/io';
import { FiAlignLeft } from 'react-icons/fi';
import { CardService } from '../../services/card.service.ts';
import { toast } from 'react-toastify';
import { FaComment } from 'react-icons/fa';
import { useMutation, useQueryClient } from 'react-query';

interface EditCardModalProps {
	card: ICard;
	list: IList;
}

const EditCardModal : FC<EditCardModalProps> = ({card, list}) => {
	const [cardName, setCardName] = useState<string>(card.name);
	const [cardDescription, setCardDescription] = useState<string>(card.description ? card.description : '' );

	const queryClient = useQueryClient();
	const {mutate: updateCard} = useMutation(() => CardService.update({
		id: +card.id,
		name: cardName,
		description: cardDescription
	}), {onSuccess: () => queryClient.invalidateQueries('boards')})

	const cardUpdateHandler = async () => {
		try {
			updateCard();
		}
		catch (error : any){
			toast.error((error.response?.data.message).toString());
		}
	}

	return (
		<div className='flex flex-col'>
			<section className='grid edit-card-section max-width pr-2'>
				<IoMdCard className='m-auto'/>
				<textarea
					rows={1} maxLength={60} className='ml-2 resize-none text-2xl font-medium' value={cardName}
					onChange={(e) => setCardName(e.target.value)}
					onBlur={cardUpdateHandler} placeholder='Card Name'></textarea>
				<div></div>
				<div className='ml-2'>in list "{list.name}"</div>
			</section>
			<section className='grid edit-card-section max-width pr-2 mt-2'>
				<FiAlignLeft className='m-auto' />
				<div className='ml-2 text-2xl font-medium'>Description</div>

				<div></div>
				<textarea className='ml-2 resize-none text-2xl font-medium' value={cardDescription}
						  onChange={(e) => setCardDescription(e.target.value)}
						  onBlur={cardUpdateHandler} placeholder='Card Description'></textarea>
			</section>
			<section className='grid edit-card-section max-width pr-2 mt-2'>
				<FaComment  className='m-auto' />
				<div className='ml-2 text-2xl font-medium'>Comments</div>

				<div></div>
				<div></div>
				{/*<textarea className='ml-2 resize-none text-2xl font-medium' value={cardDescription}*/}
				{/*		  onChange={(e) => setCardDescription(e.target.value)}*/}
				{/*		  onBlur={cardUpdateHandler} placeholder='Card Description'></textarea>*/}
			</section>
		</div>
	);
}

export default EditCardModal;