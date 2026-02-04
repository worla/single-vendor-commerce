import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Headers,
    Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import {
    CreateOrderDto,
    UpdateOrderStatusDto,
    AssignDeliveryDto,
} from './dto/order.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiHeader({ name: 'x-session-id', required: false, description: 'Guest session ID if user is not logged in' })
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Order created successfully' })
    create(
        @Body() createOrderDto: CreateOrderDto,
        @GetUser() user: any,
        @Headers('x-session-id') sessionId?: string,
    ) {
        return this.ordersService.create(
            { ...createOrderDto, sessionId },
            user?.id,
        );
    }

    @Get()
    @ApiOperation({ summary: 'Get orders (filtered by role)' })
    @ApiBearerAuth()
    @ApiQuery({ name: 'deliveryPersonId', required: false, description: 'Filter by delivery person ID (Admin only)' })
    @ApiResponse({ status: 200, description: 'List of orders' })
    @UseGuards(AuthGuard('jwt'))
    findAll(
        @GetUser() user: any,
        @Query('deliveryPersonId') deliveryPersonId?: string,
    ) {
        // Admins can see all orders
        if (user.role === UserRole.ADMIN) {
            return this.ordersService.findAll(undefined, deliveryPersonId);
        }
        // Delivery people see their assigned orders
        if (user.role === UserRole.DELIVERY) {
            return this.ordersService.findAll(undefined, user.id);
        }
        // Buyers see only their orders
        return this.ordersService.findAll(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an order by ID' })
    @ApiResponse({ status: 200, description: 'Order details' })
    @ApiResponse({ status: 404, description: 'Order not found' })
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update order status (Admin/Delivery only)' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Order status updated' })
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.DELIVERY)
    updateStatus(
        @Param('id') id: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateStatus(id, updateOrderStatusDto);
    }

    @Patch(':id/assign-delivery')
    @ApiOperation({ summary: 'Assign delivery person to an order (Admin only)' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Delivery person assigned' })
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    assignDelivery(
        @Param('id') id: string,
        @Body() assignDeliveryDto: AssignDeliveryDto,
    ) {
        return this.ordersService.assignDelivery(id, assignDeliveryDto);
    }
}
