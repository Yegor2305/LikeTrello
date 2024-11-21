import {Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Board} from "../../board/entities/board.entity";

@Entity()
@Unique(['userWhoShared', 'userSharedWith', 'board'])
export class Shared {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.meShared)
    userWhoShared: User;

    @ManyToOne(() => User, (user) => user.sharedWithMe)
    userSharedWith: User;

    @ManyToOne(() => Board, (board) => board.shared)
    board: Board;
}
