import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	text: string;

	@CreateDateColumn()
	createdAt: Date;


}
