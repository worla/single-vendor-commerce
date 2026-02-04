import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Electronics' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'https://example.com/image.jpg' })
    @IsString()
    @IsNotEmpty()
    image: string;

    @ApiProperty({ example: 'https://example.com/banner.jpg' })
    @IsString()
    @IsNotEmpty()
    bannerImage: string;

    @ApiProperty({ example: 'All kinds of electronic gadgets' })
    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UpdateCategoryDto {
    @ApiProperty({ example: 'Electronics', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
    @IsOptional()
    @IsString()
    image?: string;

    @ApiProperty({ example: 'https://example.com/banner.jpg', required: false })
    @IsOptional()
    @IsString()
    bannerImage?: string;

    @ApiProperty({ example: 'All kinds of electronic gadgets', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
