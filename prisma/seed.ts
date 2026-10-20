import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding...');

  const products = [
    // Boissons
    { name: 'L\'Avenue Brown Sugar', description: 'Bubble tea au lait avec brown sugar', price: 1700, category: 'Boissons', available: true },
    { name: 'L\'Avenue Taro', description: 'Bubble tea à la taro', price: 1700, category: 'Boissons', available: true },
    { name: 'L\'Avenue Matcha', description: 'Bubble tea au matcha', price: 1800, category: 'Boissons', available: true },
    { name: 'L\'Avenue Thai Tea', description: 'Bubble tea au thé thaï', price: 1600, category: 'Boissons', available: true },
    { name: 'L\'Avenue Mango', description: 'Bubble tea à la mangue', price: 1800, category: 'Boissons', available: true },
    { name: 'L\'Avenue Strawberry', description: 'Bubble tea à la fraise', price: 1800, category: 'Boissons', available: true },
    { name: 'L\'Avenue Lychee', description: 'Bubble tea au litchi', price: 1800, category: 'Boissons', available: true },
    { name: 'Jus d\'orange frais', description: 'Jus d\'orange pressé', price: 1500, category: 'Boissons', available: true },
    { name: 'Jus d\'ananas frais', description: 'Jus d\'ananas pressé', price: 1500, category: 'Boissons', available: true },
    { name: 'Limonade maison', description: 'Limonade fraîche', price: 1200, category: 'Boissons', available: true },

    // Salé
    { name: 'Croque Avenue Madame', description: 'Pain, jambon, fromage, œuf', price: 3000, category: 'Salé', available: true },
    { name: 'Croque Avenue Monsieur', description: 'Pain, jambon, fromage', price: 2500, category: 'Salé', available: true },
    { name: 'Sandwich poulet', description: 'Pain, poulet, crudités', price: 2800, category: 'Salé', available: true },
    { name: 'Burger Avenue', description: 'Bœuf, fromage, sauce', price: 4500, category: 'Salé', available: true },
    { name: 'Tacos poulet', description: 'Tacos au poulet', price: 3500, category: 'Salé', available: true },
    { name: 'Tacos viande', description: 'Tacos à la viande', price: 4000, category: 'Salé', available: true },
    { name: 'Frites maison', description: 'Frites fraîches', price: 1500, category: 'Salé', available: true },
    { name: 'Nuggets (6 pièces)', description: 'Nuggets de poulet', price: 2500, category: 'Salé', available: true },
    { name: 'Ailes de poulet (6 pièces)', description: 'Ailes de poulet croustillantes', price: 3000, category: 'Salé', available: true },
    { name: 'Salade César', description: 'Salade, poulet, parmesan', price: 3500, category: 'Salé', available: true },

    // Sucré
    { name: 'Pancake caramel', description: 'Pancakes au sirop d\'érable', price: 2500, category: 'Sucré', available: true },
    { name: 'Pancake chocolat', description: 'Pancakes au chocolat', price: 2500, category: 'Sucré', available: true },
    { name: 'Waffle fruits', description: 'Gaufre avec fruits frais', price: 3000, category: 'Sucré', available: true },
    { name: 'Waffle nutella', description: 'Gaufre au nutella', price: 2800, category: 'Sucré', available: true },
    { name: 'Cheesecake', description: 'Cheesecake aux fruits', price: 3000, category: 'Sucré', available: true },
    { name: 'Brownie', description: 'Brownie au chocolat', price: 2000, category: 'Sucré', available: true },
    { name: 'Cookie géant', description: 'Cookie au chocolat', price: 1500, category: 'Sucré', available: true },
    { name: 'Muffin chocolat', description: 'Muffin au chocolat', price: 1200, category: 'Sucré', available: true },
    { name: 'Muffin myrtille', description: 'Muffin aux myrtilles', price: 1200, category: 'Sucré', available: true },
    { name: 'Crêpe sucre', description: 'Crêpe au sucre', price: 1500, category: 'Sucré', available: true },
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
