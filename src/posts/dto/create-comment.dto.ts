import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const ALLOWED_COMMENTS = [
    'Great',
    'Excellent',
    'God is with you',
    'Allah is with you',
    'I advice you see a doctor as soon as possible'
];

export class CreateCommentDto {
    @ApiProperty({ enum: ALLOWED_COMMENTS })
    @IsString()
    @IsIn(ALLOWED_COMMENTS, { message: 'Comment must be one of the allowed phrases.' })
    content: string;
}
