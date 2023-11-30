import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { Tokens } from './types'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { Public, GetUserId, GetUser } from '../common/decorators'
import { RtGuard } from '../common/guards'

@ApiTags("Auth")
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('/signup')
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
    description: 'User did not register, because of incorrect email or zero password',
  })
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<Tokens>{
    return this.authService.signupLocal(dto)
  }

  @Public()
  @Post('/signin')
  @ApiOkResponse({
      description: 'User logged successfully',
      type: Tokens
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized, user does not exist"
  })
  @ApiBadRequestResponse({
    description: 'User did not signin, because the invalid email or password',
  })
  @HttpCode(HttpStatus.OK)
  signInLocal(@Body() dto: AuthDto){
    return this.authService.signInLocal(dto)
  }

  @Post('/logout')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
      description: 'User logout successfully',
      type: Boolean
  })
  @ApiUnauthorizedResponse({
      description: 'User did not log out, because the invalid access token'
  })
  logout(@GetUserId() userId: number): Promise<Boolean>{
    return this.authService.logout(userId)
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @ApiBearerAuth('refresh-jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
      description: 'User have refresh token successfully',
      type: Tokens
  })
  @ApiUnauthorizedResponse({
    description: 'User did not receive new tokens, because the invalid refresh token',
  })
  refreshTokens(
      @GetUserId() userId: number,
      @GetUser('refreshToken')
      refreshToken: string,
    ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken)
  }

  @Post('/reset-password')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User changed password successfully',
    type: Tokens
  })
  @ApiForbiddenResponse({
    description: 'User did not change password, because the invalid email token'
  })
  @ApiUnauthorizedResponse({
    description: 'User not have, because the invalid access token',
  })
  resetPassword(@GetUserId() userId: number, @Body() dto: AuthDto): Promise<Tokens>{
    return this.authService.resetPassword(userId, dto)
  }
}
