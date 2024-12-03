import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Card} from "../../card/entities/card.entity";
import {Board} from "../../board/entities/board.entity";

@Entity()
export class List {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({default: 1})
    position: number;

    @OneToMany(() => Card, card => card.list)
    cards: Card[];

    @ManyToOne(() => Board, board => board.lists)
    board: Board;
}
