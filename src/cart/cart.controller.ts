import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Get current user or guest cart' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Guest session ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Current cart details' })
    getCart(
        @GetUser() user: any,
        @Headers('x-session-id') sessionId?: string,
    ) {
        return this.cartService.getCart(user?.id, sessionId);
    }

    @Post('items')
    @ApiOperation({ summary: 'Add an item to the cart' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Guest session ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Item added to cart' })
    addToCart(
        @Body() addToCartDto: AddToCartDto,
        @GetUser() user: any,
        @Headers('x-session-id') sessionId?: string,
    ) {
        return this.cartService.addToCart(
            { ...addToCartDto, sessionId },
            user?.id,
        );
    }

    @Patch('items/:id')
    @ApiOperation({ summary: 'Update cart item quantity' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Guest session ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Cart item updated' })
    updateCartItem(
        @Param('id') id: string,
        @Body() updateCartItemDto: UpdateCartItemDto,
        @GetUser() user: any,
        @Headers('x-session-id') sessionId?: string,
    ) {
        return this.cartService.updateCartItem(id, updateCartItemDto, user?.id, sessionId);
    }

    @Delete('items/:id')
    @ApiOperation({ summary: 'Remove an item from the cart' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Guest session ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Item removed from cart' })
    removeCartItem(
        @Param('id') id: string,
        @GetUser() user: any,
        @Headers('x-session-id') sessionId?: string,
    ) {
        return this.cartService.removeCartItem(id, user?.id, sessionId);
    }

    @Delete('clear')
    @ApiOperation({ summary: 'Clear the entire cart' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Guest session ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Cart cleared' })
    clearCart(
        @GetUser() user: any,
        @Headers('x-session-id') sessionId?: string,
    ) {
        return this.cartService.clearCart(user?.id, sessionId);
    }
}
