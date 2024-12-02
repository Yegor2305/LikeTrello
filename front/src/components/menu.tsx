import { FC, useEffect, useState } from 'react';
import { IBoard } from '../types/types.ts';
import { UserService } from '../services/user.service.ts';
import { BoardDisplay } from '../pages/board-display.tsx';
import { useQuery } from 'react-query';

const Menu : FC = () => {

	const { data : boards, isSuccess } = useQuery('boards', UserService.getBoards)
	const { data : sharedBoards } = useQuery('sharedBoards', UserService.getSharedBoards)

	const [activeBoard, setActiveBoard] = useState<IBoard>();

	useEffect(() => {
		if (isSuccess){
			setActiveBoard(boards[0])
		}
	}, [isSuccess, boards]);

	return <div className='flex flex-x flex-1'>
		<div className='left-side-menu'>
			<div className='left-side-menu-header'>Your boards:</div>
			{
				boards?.map((board) => {
					return <div onClick={() => setActiveBoard(board)}
								className='left-side-menu-item'
								key={board.id}>ʘ {board.name} {board.user?.username}</div>;
				})
			}
			{
				<div>
					<div className='left-side-menu-header'>Shared boards:</div>
					{
						sharedBoards?.map((board) => (
							<div onClick={() => setActiveBoard(board)} className='left-side-menu-item'
								 key={board.id}>ʘ {board.name} {board.user?.username}</div>
						))
					}
				</div>
			}

		</div>
		{
			activeBoard && (
				<BoardDisplay boardToDisplay={activeBoard} shared={false} />
			)
		}

	</div>;

}

export default Menu;