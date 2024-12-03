import { FC, useEffect, useState } from 'react';
import { IBoard } from '../types/types.ts';
import { UserService } from '../services/user.service.ts';
import { BoardDisplay } from '../pages/board-display.tsx';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setShared } from '../store/boardSlice.ts';

const queryOptions = {
	keepPreviousData: true
}

const Menu : FC = () => {

	const { data : boards, isLoading, isSuccess } = useQuery('boards',
		() => UserService.getBoards(true), queryOptions)
	const { data : sharedBoards } = useQuery('sharedBoards',
		() => UserService.getSharedBoards(true), queryOptions)

	const [activeBoard, setActiveBoard] = useState<IBoard>();
	const dispatch = useDispatch();

	useEffect(() => {
		if (isSuccess){
			setActiveBoard(boards[0])
		}
	}, [isSuccess, boards]);

	return <div className='flex flex-x flex-1'>
		<div className='left-side-menu'>
			<div className='left-side-menu-header'>Your boards:</div>
			{
				!isLoading && (boards?.map((board) => {
					return <div onClick={() => {
						dispatch(setShared(false))
						setActiveBoard(board);
					}}
					className='left-side-menu-item'
					key={board.id}>ʘ {board.name} {board.user?.username}</div>;
				}))
			}
			{
				<div>
					<div className='left-side-menu-header'>Shared boards:</div>
					{
						!isLoading && (sharedBoards?.map((board) => (
							<div onClick={() => {
								dispatch(setShared(true))
								setActiveBoard(board);
							}} className='left-side-menu-item'
								 key={board.id}>ʘ {board.name} {board.user?.username}</div>
						)))
					}
				</div>
			}

		</div>
		{
			(activeBoard && !isLoading) ? (
				<BoardDisplay boardToDisplay={activeBoard} />
			) : (
				<div className='loader'></div>
			)
		}

	</div>;

}

export default Menu;