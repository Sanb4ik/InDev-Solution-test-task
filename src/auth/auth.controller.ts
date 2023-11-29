import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import {ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags} from "@nestjs/swagger";
import { Users } from "./entity/user.entity";

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @UseGuards(AuthGuard('jwt'))
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
    return this.authService.logout(user['sub'])
  }

  @UseGuards(AuthGuard('jwt-refresh'))
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
  refreshTokens(@Req() req: Request){
    const user = req.user;
    return this.authService.refreshTokens(user['sub'], user['refreshToken'])
  }
}
