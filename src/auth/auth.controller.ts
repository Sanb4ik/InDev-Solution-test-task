import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Public, GetUserId, GetUser } from '../common/decorators';
import { RtGuard } from '../common/guards';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('/local/signup')
  @ApiCreatedResponse({
      description: 'User registered successfully',
      type: Tokens
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: "Unauthorized, user already exists"
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'User not registered, because of incorrect email or zero password',
  })
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<Tokens>{
    return this.authService.signupLocal(dto)
  }

  @Public()
  @Post('/local/signin')
  @ApiOkResponse({
      description: 'User logged successfully',
      type: Tokens
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized, user does not exist"
  })
  @ApiBadRequestResponse({
    description: 'User not logged, because of incorrect email or password',
  })
  @HttpCode(HttpStatus.OK)
  signInLocal(@Body() dto: AuthDto){
    return this.authService.signInLocal(dto)
  }

  @Post('logout')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
      description: 'User logout successfully',
      type: Boolean
  })
  @ApiUnauthorizedResponse({
      description: 'User not logged out due to incorrect jwt access token'
  })
  logout(@GetUserId() userId: number): Promise<Boolean>{
    return this.authService.logout(userId)
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiBearerAuth('refresh-jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
      description: 'User have refresh token successfully',
      type: Tokens
  })
  @ApiUnauthorizedResponse({
    description: 'User not have, because of incorrect refresh token',
  })
  refreshTokens(
      @GetUserId() userId: number,
      @GetUser('refreshToken')
      refreshToken: string,
    ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken)
  }
}
