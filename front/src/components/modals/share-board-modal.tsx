import { FC, useState } from 'react';

interface ShareModalProps{
	onSubmit: (email : string) => Promise<void>;
}

const ShareBoardModal : FC<ShareModalProps> = ({ onSubmit }) => {

	const [email, setEmail] = useState<string>('');

	const shareHandler = async (event : any) => {
		event.preventDefault();
		onSubmit(email);
	}

	return <div className='modal'>
		<form className='modal-form' onSubmit={(e) => shareHandler(e)}>
			<input type='email' placeholder='Email to share with' autoFocus={true}
			value={email} onChange={(e) => setEmail(e.target.value)}/>
			<button>Share</button>
		</form>
	</div>
}

export default ShareBoardModal;