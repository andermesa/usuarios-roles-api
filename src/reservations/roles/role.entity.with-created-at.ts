import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';


@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

    @Column({ name: 'role_name', type: 'varchar', length: 50, unique: true })
    roleName!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description!: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @ManyToMany(() => User, (user) => user.roles)
    users!: User[];
}
