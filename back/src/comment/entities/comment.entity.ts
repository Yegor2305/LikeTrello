import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

	@ManyToOne(() => Card, card => card.comments)
	card: Card;
}
