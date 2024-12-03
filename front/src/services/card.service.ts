import { instanceAuth } from '../api/axios.api.ts';

interface UpdateCardProps{
	id: number;
	name: string;
	description: string;
}

export const CardService = {

	async update(props : UpdateCardProps): Promise<void> {
		await instanceAuth.patch<void>("/card/update", props);
	}

}