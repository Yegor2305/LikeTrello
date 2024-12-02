import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Card } from '../../card/entities/card.entity';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	text: string;

	@CreateDateColumn()
	createdAt: Date;

	@ManyToOne(() => User, user => user.comments)
	author: User;

	@ManyToOne(() => Comment, comment => comment)
	replyTo: Comment;

	@OneToMany(() => Comment, comment => comment)
	replies: Comment[];

	@ManyToOne(() => Card, card => card.comments)
	card: Card;
}
