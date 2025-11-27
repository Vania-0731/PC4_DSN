import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  twoFactorSecret: string;

  @Column({ default: true })
  isTwoFactorEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
