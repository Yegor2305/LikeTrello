import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Board} from "../../board/entities/board.entity";
import {Shared} from "../../shared/entities/shared.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: "email@gmail.com", unique: true})
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
}