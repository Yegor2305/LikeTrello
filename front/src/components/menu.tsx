import { FC, useEffect, useState } from 'react';
import { IBoard, MenuProps } from '../types/types.ts';
import { UserService } from '../services/user.service.ts';
import { BoardDisplay } from '../pages/board-display.tsx';

const Menu : FC<MenuProps> = ({forPage}) => {

	const [boards, setBoards] = useState<IBoard[]>([]);
	const [activeBoard, setActiveBoard] = useState<IBoard>();

	const getBoards = async () =>{
		let data : IBoard[] = [];
		switch (forPage){
			case 'home':
				data = await UserService.getBoards();
				break;
			case 'shared':
				data = await UserService.getSharedBoards();
				break;
			default:
				break;
		}
		if (data) setBoards(data);
		setActiveBoard(data[0]);
	}

	useEffect(() => {
		getBoards();
	}, [forPage]);

	useEffect(() => {
		getBoards()
	}, []);
	
	return <div className='flex flex-x flex-1'>
		<div className='left-side-menu'>
			<div className='left-side-menu-header'>Boards:</div>
			{
				boards.map((board) => (
					<div className='left-side-menu-item' key={board.id}>ʘ {board.name} {board.user?.username}</div>
				))
			}
		</div>
		{
			activeBoard && (
				<BoardDisplay boardToDisplay={activeBoard} shared={forPage === 'shared'}/>
			)
		}

	</div>
}

export default Menu;