import { instanceAuth } from '../api/axios.api.ts';

interface LeaveCommentProps {
	text: string;
	targetCardId: number;
}

export const CommentService = {

	async getComments(cardId: number): Promise<any> {
		return await instanceAuth.get<void>(`/comment/get-comments/${cardId}`);
	},

	async leaveComment(props : LeaveCommentProps): Promise<void> {
		await instanceAuth.post<void>("/comment/leave-comment", props);
	}

}