import { useDispatch, useSelector } from 'react-redux'
import {RootState , AppDispatch} from './store.ts';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAuth = () : boolean => {
    return useAppSelector((state) => state.user.isAuthenticated);
}
export const useIsShared = () : boolean => {
    return useAppSelector((state) => state.board.shared);
}