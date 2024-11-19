import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Card} from "../../card/entities/card.entity";
import {User} from "../../user/entities/user.entity";

@Entity()
export class List {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Card, card => card.list)
    cards: Card[];

    @ManyToOne(() => User, user => user.lists)
    user: User;
}
