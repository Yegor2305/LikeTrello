import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAuth } from '../store/hooks.ts';
import Auth from '../pages/auth.tsx';
import { UserService } from '../services/user.service.ts';
import { toast } from 'react-toastify';
import ConfirmSharingDefault from './confirm-sharing-default.tsx';
import { logout } from '../store/userSlice.ts';

const ConfirmSharing : FC = () => {

	const confirmSharingHandler = async () => {
		if (!token) {
			toast.error('Error');
			return;
		}

		const result = await UserService.confirmBoardSharing(token);

		if (result.success){
			toast.success('Board shared');
			navigate('/');
		}
		else{
			toast.error(result.message);
			dispatch(logout());
			setLayout(<Auth goTo={`/confirm-board-sharing/${token}`} />);
		}
	}

	const isAuth = useAuth();
	const dispatch = useAppDispatch();

	const navigate = useNavigate()

	const { token } = useParams();
	const [layout, setLayout] = useState(isAuth ?
		<ConfirmSharingDefault onClick={confirmSharingHandler}/> :
		<Auth goTo={`/confirm-board-sharing/${token}`} />);

	useEffect(() => {
		setLayout(isAuth ? <ConfirmSharingDefault onClick={confirmSharingHandler}/> :
								<Auth goTo={`/confirm-board-sharing/${token}`} />);
	}, [isAuth]);

	return layout
}

export default ConfirmSharing;