import { FC, useEffect, useState } from 'react';
import { IBoard } from '../types/types.ts';
import { UserService } from '../services/user.service.ts';
import { BoardDisplay } from '../pages/board-display.tsx';

const Menu : FC = () => {

	const [boards, setBoards] = useState<IBoard[]>([]);
	const [sharedBoards, setSharedBoards] = useState<IBoard[]>([]);
	const [activeBoard, setActiveBoard] = useState<IBoard>();

	const getBoards = async () => {
		const data = await UserService.getBoards();
		if (data) {
			setBoards(data);
			setActiveBoard(data[0]);
		}
		{
			const data = await UserService.getSharedBoards();
			if (data) setSharedBoards(data);
		}

	}

	useEffect(() => {
		getBoards()
	}, []);
	
	return <div className='flex flex-x flex-1'>
		<div className='left-side-menu'>
			<div className='left-side-menu-header'>Your boards:</div>
			{
				boards.map((board) => {
					return <div onClick={() => setActiveBoard(board)}
						 className='left-side-menu-item'
						 key={board.id}>ʘ {board.name} {board.user?.username}</div>
				})
			}
			{
				sharedBoards.length > 0 && (
					<div>
						<div className='left-side-menu-header'>Shared boards:</div>
						{
							sharedBoards.map((board) => (
								<div onClick={() => setActiveBoard(board)} className='left-side-menu-item'
									 key={board.id}>ʘ {board.name} {board.user?.username}</div>
								))
						}
					</div>


				)
			}

		</div>
		{
			activeBoard && (
				<BoardDisplay boardToDisplay={activeBoard} shared={false}/>
			)
		}

	</div>
}

export default Menu;