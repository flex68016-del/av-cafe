import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding...');

  const products = [
    // Boissons
    { name: 'L\'Avenue Brown Sugar', description: 'Bubble tea au lait avec brown sugar', price: 1700, category: 'Boissons', image: 'https://images.unsplash.com/photo-1558200104-7d6c9ef67653?w=800', available: true },
    { name: 'L\'Avenue Taro', description: 'Bubble tea à la taro', price: 1700, category: 'Boissons', image: 'https://images.unsplash.com/photo-1558200104-7d6c9ef67653?w=800', available: true },
    { name: 'L\'Avenue Matcha', description: 'Bubble tea au matcha', price: 1800, category: 'Boissons', image: 'https://images.unsplash.com/photo-1563822249366-3ef9d5896c18?w=800', available: true },
    { name: 'L\'Avenue Thai Tea', description: 'Bubble tea au thé thaï', price: 1600, category: 'Boissons', image: 'https://images.unsplash.com/photo-1558200104-7d6c9ef67653?w=800', available: true },
    { name: 'L\'Avenue Mango', description: 'Bubble tea à la mangue', price: 1800, category: 'Boissons', image: 'https://images.unsplash.com/photo-1558200104-7d6c9ef67653?w=800', available: true },
    { name: 'L\'Avenue Strawberry', description: 'Bubble tea à la fraise', price: 1800, category: 'Boissons', image: 'https://images.unsplash.com/photo-1558200104-7d6c9ef67653?w=800', available: true },
    { name: 'L\'Avenue Lychee', description: 'Bubble tea au litchi', price: 1800, category: 'Boissons', image: 'https://images.unsplash.com/photo-1558200104-7d6c9ef67653?w=800', available: true },
    { name: 'Jus d\'orange frais', description: 'Jus d\'orange pressé', price: 1500, category: 'Boissons', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800', available: true },
    { name: 'Jus d\'ananas frais', description: 'Jus d\'ananas pressé', price: 1500, category: 'Boissons', image: 'https://images.unsplash.com/photo-1558200104-7d6c9ef67653?w=800', available: true },
    { name: 'Limonade maison', description: 'Limonade fraîche', price: 1200, category: 'Boissons', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800', available: true },

    // Salé
    { name: 'Croque Avenue Madame', description: 'Pain, jambon, fromage, œuf', price: 3000, category: 'Salé', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800', available: true },
    { name: 'Croque Avenue Monsieur', description: 'Pain, jambon, fromage', price: 2500, category: 'Salé', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800', available: true },
    { name: 'Sandwich poulet', description: 'Pain, poulet, crudités', price: 2800, category: 'Salé', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800', available: true },
    { name: 'Burger Avenue', description: 'Bœuf, fromage, sauce', price: 4500, category: 'Salé', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', available: true },
    { name: 'Tacos poulet', description: 'Tacos au poulet', price: 3500, category: 'Salé', image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800', available: true },
    { name: 'Tacos viande', description: 'Tacos à la viande', price: 4000, category: 'Salé', image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800', available: true },
    { name: 'Frites maison', description: 'Frites fraîches', price: 1500, category: 'Salé', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800', available: true },
    { name: 'Nuggets (6 pièces)', description: 'Nuggets de poulet', price: 2500, category: 'Salé', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800', available: true },
    { name: 'Ailes de poulet (6 pièces)', description: 'Ailes de poulet croustillantes', price: 3000, category: 'Salé', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800', available: true },
    { name: 'Salade César', description: 'Salade, poulet, parmesan', price: 3500, category: 'Salé', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800', available: true },

    // Sucré
    { name: 'Pancake caramel', description: 'Pancakes au sirop d\'érable', price: 2500, category: 'Sucré', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800', available: true },
    { name: 'Pancake chocolat', description: 'Pancakes au chocolat', price: 2500, category: 'Sucré', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800', available: true },
    { name: 'Waffle fruits', description: 'Gaufre avec fruits frais', price: 3000, category: 'Sucré', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800', available: true },
    { name: 'Waffle nutella', description: 'Gaufre au nutella', price: 2800, category: 'Sucré', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800', available: true },
    { name: 'Cheesecake', description: 'Cheesecake aux fruits', price: 3000, category: 'Sucré', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', available: true },
    { name: 'Brownie', description: 'Brownie au chocolat', price: 2000, category: 'Sucré', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800', available: true },
    { name: 'Cookie géant', description: 'Cookie au chocolat', price: 1500, category: 'Sucré', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800', available: true },
    { name: 'Muffin chocolat', description: 'Muffin au chocolat', price: 1200, category: 'Sucré', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800', available: true },
    { name: 'Muffin myrtille', description: 'Muffin aux myrtilles', price: 1200, category: 'Sucré', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800', available: true },
    { name: 'Crêpe sucre', description: 'Crêpe au sucre', price: 1500, category: 'Sucré', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800', available: true },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
