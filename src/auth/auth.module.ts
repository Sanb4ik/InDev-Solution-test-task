import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from "@nestjs/jwt"
import { TypeOrmModule } from "@nestjs/typeorm"
import { RefreshTokens } from "./entity/tokens.entity"
import { Users } from "./entity/user.entity"
import { AccessStrategy, RefreshStrategy } from "./strategies"

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([RefreshTokens, Users])
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessStrategy, RefreshStrategy],
})
export class AuthModule {}
