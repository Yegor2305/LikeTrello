import {FC} from "react";

const ShareBoardModal : FC = () => {
	return <div className='modal'>
		<form className='modal-form'>
			<input type='email' placeholder='Email to share with' autoFocus={true}/>
			<button>Share</button>
		</form>
	</div>
}

export default ShareBoardModal;