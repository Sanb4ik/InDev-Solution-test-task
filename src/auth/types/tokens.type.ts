import {ApiProperty} from "@nestjs/swagger";

export class Tokens {
    @ApiProperty({
        type: String,
        description: "access token"
    })
    access_token: string

    @ApiProperty({
        type: String,
        description: "refresh token"
    })
    refresh_token: string
}