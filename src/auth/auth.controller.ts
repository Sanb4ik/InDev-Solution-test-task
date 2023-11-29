import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import {ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import { Users } from "./entity/user.entity";
import { Public, GetUserId, GetUser } from '../common/decorators';
import { RtGuard } from '../common/guards';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('/local/signup')
  @ApiBearerAuth()
  @ApiCreatedResponse({
      description: 'User registered successfully',
      type: Tokens
    }
  )
  @ApiBadRequestResponse({
    description: 'User not registered, because of incorrect email or zero password',
  })
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<Tokens>{
    return this.authService.signupLocal(dto)
  }

  @Public()
  @Post('/local/signin')
  @ApiBearerAuth()
  @ApiCreatedResponse({
      description: 'User logged successfully',
      type: Tokens
    }
  )
  @ApiBadRequestResponse({
    description: 'User not logged, because of incorrect email or password',
  })
  @HttpCode(HttpStatus.OK)
  signInLocal(@Body() dto: AuthDto){
    return this.authService.signInLocal(dto)
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Public()
  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
      description: 'User logout successfully',
      type: Users
    }
  )
  @ApiBadRequestResponse({
    description: 'User not logout, because of incorrect jwt token',
  })
  logout(@Req() req: Request){
    const user = req.user
    console.log(user)
    return this.authService.logout(user['sub'])
  }

  // @UseGuards(AuthGuard('jwt-refresh'))
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
      description: 'User have refresh token successfully',
      type: Tokens
    }
  )
  @ApiBadRequestResponse({
    description: 'User not have, because of incorrect refresh token',
  })
  refreshTokens(
    @GetUserId() userId: number,
    @GetUser('refreshToken') refreshToken: string,
  ){
    console.log(refreshToken)
    return this.authService.refreshTokens(userId, refreshToken)
  }
}
