"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommentDto = exports.ALLOWED_COMMENTS = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
exports.ALLOWED_COMMENTS = [
    'Great',
    'Excellent',
    'God is with you',
    'Allah is with you',
    'I advice you see a doctor as soon as possible'
];
class CreateCommentDto {
    content;
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: exports.ALLOWED_COMMENTS }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(exports.ALLOWED_COMMENTS, { message: 'Comment must be one of the allowed phrases.' }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
//# sourceMappingURL=create-comment.dto.js.map