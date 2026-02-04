import { Controller, Post, Get, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { GetUser } from './decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService,
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'User logged in successfully' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('profile')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@GetUser() user: any) {
        return this.authService.getProfile(user.id);
    }

    @Post('logout')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout user (clear refresh token)' })
    @UseGuards(AuthGuard('jwt'))
    async logout(@GetUser() user: any) {
        return this.authService.logout(user.id);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Tokens refreshed successfully' })
    @ApiResponse({ status: 403, description: 'Access Denied' })
    async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        // We need to decode the sub from the token manually or just expect it in the body.
        // For better security, we decode it.
        const decodedToken: any = this.jwtService.decode(refreshTokenDto.refreshToken);
        if (!decodedToken || !decodedToken.sub) {
            throw new ForbiddenException('Access Denied');
        }
        return this.authService.refreshTokens(decodedToken.sub, refreshTokenDto.refreshToken);
    }

    @Get('users')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get users by role (Admin only)' })
    @UseGuards(AuthGuard('jwt'))
    async getUsers(@GetUser() user: any) {
        // Only admins can fetch users
        if (user.role !== 'ADMIN') {
            throw new ForbiddenException('Access Denied');
        }
        return this.authService.getUsersByRole();
    }
}
