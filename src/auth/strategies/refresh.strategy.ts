import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(@Inject(ConfigService) private config: ConfigService) {
    const secret = config.get<string>("jwt_refresh.secret");
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      passReqToCallback: true,
     });
  }

  validate(req: Request,payload: any){
    const refreshToken = req.get("authorization")?.replace("Bearer","").trim();
    if (!refreshToken) throw new ForbiddenException('Refresh token incorrect');
    return {
        ...payload,
        refreshToken
    };
  }
}