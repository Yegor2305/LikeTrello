import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {List} from "../../list/entities/list.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(() => List, (list) => list.user)
    lists: List[];
}