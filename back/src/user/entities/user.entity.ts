import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Board} from "../../board/entities/board.entity";
import {Shared} from "../../shared/entities/shared.entity";
import {Comment} from "../../comment/entities/comment.entity"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(() => Board, (board) => board.user)
    boards: Board[];

    @OneToMany(() => Shared, (shared) => shared.userWhoShared)
    meShared: Shared[];

    @OneToMany(() => Shared, (shared) => shared.userSharedWith)
    sharedWithMe: Shared[];

    @OneToMany(() => Comment, (comment) => comment.author )
    comments: Comment[];
}