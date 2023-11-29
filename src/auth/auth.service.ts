import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './types';
import { ConfigService } from '@nestjs/config';
import { RefreshTokens } from "./entity/tokens.entity";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(RefreshTokens) private tokensRepository: Repository<RefreshTokens>,
    @Inject(ConfigService) private config: ConfigService
  ) {}

  private hashData(data: string){
    return bcrypt.hash(data, 3)
  }
  private async compareSignatures(signature1, signature2): Promise<void> {
    const compare = await bcrypt.compare(signature1, signature2)
    if (!compare)
      throw new UnauthorizedException('Access Denied')
  }
  private async findUserByEmail(email: string): Promise<Users>{
    return await this.usersRepository.findOne({
      relations:{
        token: true
      },
      where:{
        email: email
      }
    })
  }
  private async findUserById(userId: number): Promise<Users>{
    return await this.usersRepository.findOne({
      relations:{
        token: true
      },
      where:{
        id: userId
      }
    })
  }
  private async updateRefreshToken( refreshToken, tokens: Tokens): Promise<void>{
    const rt_hash = await this.hashData(tokens.refresh_token);
    await this.tokensRepository.update(refreshToken, {refreshToken: rt_hash});
  }
  private async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>("jwt_access.secret"),
        expiresIn: this.config.get<string>("jwt_access.expiresIn")
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>("jwt_refresh.secret"),
        expiresIn: this.config.get<string>("jwt_refresh.expiresIn"),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async signupLocal(dto: AuthDto): Promise<Tokens>{
    const user = await this.findUserByEmail(dto.email)
    const hashPassword = await this.hashData(dto.password)

    if (user){
      throw new UnauthorizedException('user already exists')
    }
    const refreshToken = await this.tokensRepository.save({refreshToken: ""})
    const newUser = await this.usersRepository.save({
        email: dto.email,
        password: hashPassword,
        token: refreshToken
      }
    );

    const tokens = await this.getTokens(newUser.id, newUser.email)
    await this.updateRefreshToken(refreshToken, tokens)

    return tokens;
  }

  async signInLocal(dto: AuthDto): Promise<Tokens> { // to come in
    const user = await this.findUserByEmail(dto.email)

    if(!user)
      throw new UnauthorizedException('user does not exists')

    await this.compareSignatures(dto.password, user.password)

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.token, tokens)
    return tokens
  }

  async logout(userId: number): Promise<Boolean>{
    const user = await this.findUserById(userId)
    if (user && user.token) {
      await this.tokensRepository.update(user.token,{refreshToken: ""});
    }
    return true
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens>{
    const user = await this.findUserById(userId)

    if (!user || !user.token)
      throw new ForbiddenException('Access Denied. User not found');

    await this.compareSignatures(rt, user.token.refreshToken)

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRefreshToken(user.token, tokens)

    return tokens;
  }
}
