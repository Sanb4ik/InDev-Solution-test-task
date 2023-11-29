import { RefreshTokens } from "./tokens.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()

    @ApiProperty({
        type: Number,
        description: "User ID in postgres"
    })
    id: number;

    @ApiProperty({
        type: String,
        description: "User email"
    })
    @Column()
    email: string;

    @ApiProperty({
        type: String,
        description: "User hashed password"
    })
    @Column()
    password: string;


    @OneToOne(() => RefreshTokens,{ nullable: true })
    @JoinColumn()
    token: RefreshTokens
}
