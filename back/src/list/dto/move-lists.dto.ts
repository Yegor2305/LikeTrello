interface ListPosition{
	id: number;
	position: number;
}

export class MoveListsDto{
	lists: ListPosition[];
}