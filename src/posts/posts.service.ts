import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.post.findMany({
            include: {
                author: {
                    select: { id: true, firstName: true, lastName: true, role: true }
                },
                comments: {
                    include: {
                        author: { select: { id: true, firstName: true, lastName: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async create(userId: string, createPostDto: CreatePostDto) {
        return this.prisma.post.create({
            data: {
                ...createPostDto,
                authorId: userId,
            },
            include: {
                author: { select: { id: true, firstName: true, lastName: true } }
            }
        });
    }

    async addComment(userId: string, postId: string, createCommentDto: CreateCommentDto) {
        return this.prisma.comment.create({
            data: {
                content: createCommentDto.content,
                postId,
                authorId: userId,
            },
            include: {
                author: { select: { id: true, firstName: true, lastName: true } }
            }
        });
    }
}
