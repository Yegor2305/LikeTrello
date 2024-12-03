import { instanceAuth } from '../api/axios.api.ts';
import { IComment } from '../types/types.ts';

interface LeaveCommentProps {
	text: string;
	targetCardId: number;
}

export const CommentService = {

	async getComments(cardId: number): Promise<IComment[]> {
		const {data} = await instanceAuth.get<IComment[]>(`/comment/get-comments/${cardId}`);
		return data;
	},

	async leaveComment(props : LeaveCommentProps): Promise<void> {
		await instanceAuth.post<void>("/comment/leave-comment", props);
	}

}