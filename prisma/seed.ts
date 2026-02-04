import { PrismaClient, DiscountType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

    // Seed Categories
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

    // Seed Products
    const products = [
        {
            name: 'Premium Baby Stroller',
            description: 'Lightweight and durable stroller for everyday use',
            price: 299.99,
            stock: 10,
            mainImage: '/uploads/products/stroller.jpg',
            categoryId: gearCat!.id,
            discountType: DiscountType.NONE,
            discountValue: 0,
        },
        {
            name: 'The Play Gym',
            description: 'Interactive play gym for newborns',
            price: 140.00,
            stock: 25,
            mainImage: '/uploads/products/gym.jpg',
            categoryId: toysCat!.id,
            discountType: DiscountType.PERCENTAGE,
            discountValue: 15,
        },
        {
            name: 'Safe-T First Car Seat',
            description: 'Maximum security car seat for your little one',
            price: 180.00,
            stock: 5,
            mainImage: '/uploads/products/carseat.jpg',
            categoryId: gearCat!.id,
            discountType: DiscountType.NONE,
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
        } else {
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
