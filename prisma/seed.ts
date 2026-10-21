import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding...');

  const products = [
    // Boissons
    { name: 'L\'Avenue Brown Sugar', description: 'Bubble tea au lait avec brown sugar', price: 1700, category: 'Boissons', image: 'https://images.unsplash.com/photo-1558200104-7d6c9ef67653?w=800', available: true },
    { name: 'L\'Avenue Matcha', description: 'Bubble tea au matcha', price: 1800, category: 'Boissons', image: 'https://images.unsplash.com/photo-1563822249366-3ef9d5896c18?w=800', available: true },
    { name: 'L\'Avenue Mango', description: 'Bubble tea à la mangue', price: 1800, category: 'Boissons', image: 'https://images.unsplash.com/photo-1593866354354-6ce23b10c808?w=800', available: true },
    { name: 'Jus d\'orange frais', description: 'Jus d\'orange pressé', price: 1500, category: 'Boissons', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800', available: true },

    // Salé
    { name: 'Burger Avenue', description: 'Bœuf, fromage, sauce', price: 4500, category: 'Salé', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', available: true },
    { name: 'Sandwich poulet', description: 'Pain, poulet, crudités', price: 2800, category: 'Salé', image: 'https://images.unsplash.com/photo-1481070555726-e2fe83575714?w=800', available: true },
    { name: 'Frites maison', description: 'Frites fraîches', price: 1500, category: 'Salé', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800', available: true },
    { name: 'Nuggets (6 pièces)', description: 'Nuggets de poulet', price: 2500, category: 'Salé', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800', available: true },

    // Sucré
    { name: 'Waffle fruits', description: 'Gaufre avec fruits frais', price: 3000, category: 'Sucré', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800', available: true },
    { name: 'Brownie', description: 'Brownie au chocolat', price: 2000, category: 'Sucré', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800', available: true },
  ];

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  console.log(`✅ ${products.length} produits créés/mis à jour`);

  // Créer l'utilisateur gérant
  const managerEmail = process.env.MANAGER_EMAIL;
  const managerPassword = process.env.MANAGER_PASSWORD;

  if (!managerEmail || !managerPassword) {
    console.error('❌ MANAGER_EMAIL et MANAGER_PASSWORD doivent être définis dans .env');
    throw new Error('Variables d\'environnement manquantes');
  }

  const hashedManagerPassword = await bcrypt.hash(managerPassword, 10);

  await prisma.user.upsert({
    where: { email: managerEmail },
    update: {},
    create: {
      email: managerEmail,
      password: hashedManagerPassword,
      role: 'manager',
    },
  });

  console.log(`✅ Utilisateur gérant créé: ${managerEmail}`);

  // Créer l'utilisateur caissier
  const cashierEmail = process.env.CASHIER_EMAIL;
  const cashierPassword = process.env.CASHIER_PASSWORD;

  if (!cashierEmail || !cashierPassword) {
    console.error('❌ CASHIER_EMAIL et CASHIER_PASSWORD doivent être définis dans .env');
    throw new Error('Variables d\'environnement manquantes');
  }

  const hashedCashierPassword = await bcrypt.hash(cashierPassword, 10);

  await prisma.user.upsert({
    where: { email: cashierEmail },
    update: {},
    create: {
      email: cashierEmail,
      password: hashedCashierPassword,
      role: 'cashier',
    },
  });

  console.log(`✅ Utilisateur caissier créé: ${cashierEmail}`);

  // Créer des commandes de test sur différentes dates
  const dbProducts = await prisma.product.findMany();
  
  // Commandes d'hier
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(14, 0, 0, 0);

  for (let i = 0; i < 5; i++) {
    const orderTime = new Date(yesterday);
    orderTime.setHours(10 + i);
    
    const orderItems = [
      { productId: dbProducts[0].id, quantity: 1, price: dbProducts[0].price, name: dbProducts[0].name },
      { productId: dbProducts[4].id, quantity: 1, price: dbProducts[4].price, name: dbProducts[4].name },
    ];

    await prisma.order.create({
      data: {
        total: dbProducts[0].price + dbProducts[4].price,
        status: i < 3 ? 'completed' : 'preparing',
        source: i % 2 === 0 ? 'online' : 'offline',
        customerName: `Client ${i + 1}`,
        customerPhone: `+228${90100000 + i}`,
        items: {
          create: orderItems,
        },
        createdAt: orderTime,
      },
    });
  }

  // Commandes de la semaine dernière
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  lastWeek.setHours(12, 0, 0, 0);

  for (let i = 0; i < 8; i++) {
    const orderTime = new Date(lastWeek);
    orderTime.setHours(11 + i);

    const orderItems = [
      { productId: dbProducts[1].id, quantity: 1, price: dbProducts[1].price, name: dbProducts[1].name },
      { productId: dbProducts[8].id, quantity: 1, price: dbProducts[8].price, name: dbProducts[8].name },
    ];

    await prisma.order.create({
      data: {
        total: dbProducts[1].price + dbProducts[8].price,
        status: 'completed',
        source: i % 3 === 0 ? 'online' : 'offline',
        customerName: `Client Semaine ${i + 1}`,
        customerPhone: `+228${90200000 + i}`,
        items: {
          create: orderItems,
        },
        createdAt: orderTime,
      },
    });
  }

  // Commandes du mois dernier
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  lastMonth.setDate(15);
  lastMonth.setHours(15, 0, 0, 0);

  for (let i = 0; i < 15; i++) {
    const orderTime = new Date(lastMonth);
    orderTime.setDate(15 + i);

    const orderItems = [
      { productId: dbProducts[2].id, quantity: 1, price: dbProducts[2].price, name: dbProducts[2].name },
      { productId: dbProducts[5].id, quantity: 1, price: dbProducts[5].price, name: dbProducts[5].name },
    ];

    await prisma.order.create({
      data: {
        total: dbProducts[2].price + dbProducts[5].price,
        status: 'completed',
        source: i % 2 === 0 ? 'online' : 'offline',
        customerName: `Client Mois ${i + 1}`,
        customerPhone: `+228${90300000 + i}`,
        items: {
          create: orderItems,
        },
        createdAt: orderTime,
      },
    });
  }

  console.log('✅ Commandes de test créées (hier, semaine dernière, mois dernier)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
