import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {List} from "../../list/entities/list.entity";
import {Comment} from "../../comment/entities/comment.entity";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({default: 1})
    position: number;

    @Column({default: '', nullable: true})
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => List, (list) => list.cards)
    list: List

    @OneToMany(() => Comment, (comment) => comment.card)
    comments: Comment[];
}
