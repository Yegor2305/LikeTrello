import { FC } from 'react';

interface ConfirmSharingDefaultProps {
	onClick: () => void;
}

const ConfirmSharingDefault : FC<ConfirmSharingDefaultProps> = ({onClick}) => {

	return (
		<div className='flex flex-y justify-center items-center'>
			<h1 className='to-center color-first mt-20 text-3xl'>Confirm board sharing</h1>
			<button onClick={onClick} className='btn px-12 mt-5'>Confirm</button>
		</div>
	)
}

export default ConfirmSharingDefault;