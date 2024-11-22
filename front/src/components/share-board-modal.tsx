import { FC, useState } from 'react';
import { UserService } from '../services/user.service.ts';
import { ShareModalProps } from '../types/types.ts';

const ShareBoardModal : FC<ShareModalProps> = ({ boardId }) => {

	const [email, setEmail] = useState<string>('');

	const shareHandler = async () => {
		if (email.trim() !== ''){
			await UserService.sendSharingEmail({email: email, boardId: boardId});
		}
	}

	return <div className='modal'>
		<form className='modal-form'>
			<input type='email' placeholder='Email to share with' autoFocus={true}
			value={email} onChange={(e) => setEmail(e.target.value)}/>
			<button onClick={shareHandler}>Share</button>
		</form>
	</div>
}

export default ShareBoardModal;