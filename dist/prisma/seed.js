"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
        },
        create: {
            email: adminEmail,
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
        },
    });
    console.log('Admin account ensured:', admin.email);
    const categories = [
        { name: 'Toys', description: 'Educational and fun toys for all ages', image: '/uploads/categories/toys.jpg', bannerImage: '/uploads/categories/toys-banner.jpg' },
        { name: 'Fashion', description: 'Stylish clothes for babies and moms', image: '/uploads/categories/fashion.jpg', bannerImage: '/uploads/categories/fashion-banner.jpg' },
        { name: 'Gear', description: 'Strollers, car seats and more', image: '/uploads/categories/gear.jpg', bannerImage: '/uploads/categories/gear-banner.jpg' },
        { name: 'Accessories', description: 'Essential accessories', image: '/uploads/categories/acc.jpg', bannerImage: '/uploads/categories/acc-banner.jpg' },
        { name: 'Feeding', description: 'Bottles and bibs', image: '/uploads/categories/feeding.jpg', bannerImage: '/uploads/categories/feeding-banner.jpg' },
        { name: 'Nursery', description: 'Furniture and decor', image: '/uploads/categories/nursery.jpg', bannerImage: '/uploads/categories/nursery-banner.jpg' },
    ];
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: cat,
            create: cat,
        });
    }
    console.log('Categories seeded');
    const gearCat = await prisma.category.findUnique({ where: { name: 'Gear' } });
    const toysCat = await prisma.category.findUnique({ where: { name: 'Toys' } });
    const products = [
        {
            name: 'Premium Baby Stroller',
            description: 'Lightweight and durable stroller for everyday use',
            price: 299.99,
            stock: 10,
            mainImage: '/uploads/products/stroller.jpg',
            categoryId: gearCat.id,
            discountType: client_1.DiscountType.NONE,
            discountValue: 0,
        },
        {
            name: 'The Play Gym',
            description: 'Interactive play gym for newborns',
            price: 140.00,
            stock: 25,
            mainImage: '/uploads/products/gym.jpg',
            categoryId: toysCat.id,
            discountType: client_1.DiscountType.PERCENTAGE,
            discountValue: 15,
        },
        {
            name: 'Safe-T First Car Seat',
            description: 'Maximum security car seat for your little one',
            price: 180.00,
            stock: 5,
            mainImage: '/uploads/products/carseat.jpg',
            categoryId: gearCat.id,
            discountType: client_1.DiscountType.NONE,
            discountValue: 0,
        }
    ];
    for (const prod of products) {
        const existing = await prisma.product.findFirst({ where: { name: prod.name } });
        if (existing) {
            await prisma.product.update({
                where: { id: existing.id },
                data: prod,
            });
        }
        else {
            await prisma.product.create({
                data: { ...prod, supportingImages: [] },
            });
        }
    }
    console.log('Products seeded');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map