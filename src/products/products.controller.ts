import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import {
    CreateProductDto,
    UpdateProductDto,
    ApplyDiscountDto,
} from './dto/product.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product (Admin only)' })
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiQuery({ name: 'categoryId', required: false, description: 'Filter products by category ID' })
    @ApiResponse({ status: 200, description: 'List of all products' })
    findAll(@Query('categoryId') categoryId?: string) {
        return this.productsService.findAll(categoryId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a product by ID' })
    @ApiResponse({ status: 200, description: 'Product details' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a product (Admin only)' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product (Admin only)' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }

    @Patch(':id/discount')
    @ApiOperation({ summary: 'Apply discount to a product (Admin only)' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Discount applied successfully' })
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    applyDiscount(
        @Param('id') id: string,
        @Body() applyDiscountDto: ApplyDiscountDto,
    ) {
        return this.productsService.applyDiscount(id, applyDiscountDto);
    }
}
