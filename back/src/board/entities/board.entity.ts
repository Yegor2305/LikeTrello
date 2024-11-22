import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {List} from "../../list/entities/list.entity";
import {User} from "../../user/entities/user.entity";
import {Shared} from "../../shared/entities/shared.entity";

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => List, (list) => list.board)
    lists: List[];

    @ManyToOne(() => User, (user) => user.boards)
    user: User;

    @OneToMany(() => Shared, (shared) => shared.board)
    shared: Shared[];
}
