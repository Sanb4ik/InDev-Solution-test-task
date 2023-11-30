import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class RefreshTokens {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    refreshToken: string
}
