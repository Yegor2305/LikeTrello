import { FC, useState } from 'react';
import { ICard, IList } from '../../types/types.ts';
import { IoMdCard } from 'react-icons/io';
import { FiAlignLeft } from 'react-icons/fi';
import { CardService } from '../../services/card.service.ts';
import { toast } from 'react-toastify';
import { FaComment } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CommentService } from '../../services/comment.service.ts';

interface EditCardModalProps {
	card: ICard;
	list: IList;
}

const dateOptions: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	hour12: true
};

const EditCardModal : FC<EditCardModalProps> = ({card, list}) => {
	const [cardName, setCardName] = useState<string>(card.name);
	const [commentEditing, setCommentEditing] = useState<boolean>(false);
	const [cardDescription, setCardDescription] = useState<string>(card.description ? card.description : '' );
	const [commentText, setCommentText] = useState<string>('');

	const {data: comments} = useQuery('comments', () => CommentService.getComments(+card.id),
		{ keepPreviousData: true })

	const queryClient = useQueryClient();
	const {mutate: updateCard} = useMutation(() => CardService.update({
		id: +card.id,
		name: cardName,
		description: cardDescription
	}), {onSuccess: () => queryClient.invalidateQueries('boards')})

	const {mutate: leaveComment} = useMutation(() =>
		CommentService.leaveComment({text: commentText, targetCardId: +card.id}),
		{onSuccess: () => queryClient.invalidateQueries('comments')})

	const cardUpdateHandler = async () => {
		try {
			updateCard();
		}
		catch (error : any){
			toast.error((error.response?.data.message).toString());
		}
	}

	const saveCommentHandler = async () => {
		if (commentText.trim() != ''){
			leaveComment();
			setCommentEditing(false);
			setCommentText('');
		}
	}

	return (
	<>
		<div className='edit-card-modal-placeholder'></div>
		<div className='flex flex-col edit-card-modal-content'>
			<section className='grid edit-card-section max-width pr-2'>
				<IoMdCard className='m-auto' />
				<textarea
					rows={1} maxLength={60}
					className='ml-2 resize-none text-2xl font-medium bg-transparent focus:bg-white px-3 py-1.5'
					value={cardName}
					onChange={(e) => setCardName(e.target.value)}
					onBlur={cardUpdateHandler} placeholder='Card Name'></textarea>
				<div></div>
				<div className='ml-2 px-3 py-1.5'>in list "{list.name}"</div>
			</section>
			<section className='grid edit-card-section max-width pr-2 mt-2'>
				<FiAlignLeft className='m-auto' />
				<div className='ml-2 text-2xl font-medium'>Description</div>
				<div></div>
				<textarea
					className='ml-2 resize-none text-2xl font-medium rounded card-textarea px-3 py-1.5'
					value={cardDescription}
					onChange={(e) => setCardDescription(e.target.value)}
					onBlur={cardUpdateHandler} placeholder='Card Description'></textarea>
			</section>
			<section className='grid edit-card-section max-width pr-2 mt-2'>
				<FaComment className='m-auto' />
				<div className='ml-2 text-2xl font-medium'>Write a comment</div>
				<div></div>
				<div className='flex flex-y'>
					<textarea rows={commentEditing ? 4 : 1}
							  onFocus={() => setCommentEditing(true)}
							  value={commentText}
							  onChange={(e) => setCommentText(e.target.value)}
				  		className='ml-2 resize-none text-2xl font-medium bg-transparent focus:bg-white px-3 py-1.5 card-textarea'/>
					{
						commentEditing && (
							<div className='btn ml-2 m-auto px-6 mt-2' onClick={saveCommentHandler}>Save</div>
						)
					}
					{
						comments?.map((comment) => (
							<div key={comment.id} className='ml-2 font-medium'>
								<div>
									<span className='text-xl'>{comment.author.username}</span>
									<span
										className='ml-2 text-xs font-light'>{new Date(comment.createdAt).toLocaleString(undefined, dateOptions)}</span>
								</div>
								<div className='bg-white rounded px-3 py-1.5 w-96 break-words'>{comment.text}</div>
							</div>
						))
					}
				</div>
			</section>
		</div>
		<div className='edit-card-modal-placeholder'></div>
	</>
	);
}

export default EditCardModal;