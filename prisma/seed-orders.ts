import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ne jamais exécuter en production
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Ce script ne doit pas être exécuté en production');
    process.exit(1);
  }

  console.log('Création de commandes de démonstration (DEMO)...');

  const products = await prisma.product.findMany();
  if (products.length === 0) {
    console.error('❌ Aucun produit trouvé. Exécutez d\'abord le seed principal.');
    process.exit(1);
  }

  // Commandes de démonstration avec différents scénarios
  const demoOrders = [
    {
      customerName: 'DEMO Kofi',
      phone: '+22890000001',
      fulfillment: 'DELIVERY' as const,
      deliveryAddress: '12 Rue de la Paix, Lomé',
      deliveryLandmark: 'près du marché central',
      customerNote: 'Sans glaçons s\'il vous plaît',
      deliveryFee: 500,
      items: [
        { productId: products[0]?.id, name: products[0]?.name || 'L\'Avenue Brown Sugar', price: products[0]?.price || 1700, quantity: 2 },
      ],
    },
    {
      customerName: 'DEMO Awa',
      phone: '+22890000002',
      fulfillment: 'DINE_IN' as const,
      tableNumber: '5',
      customerNote: 'Allergie aux noix',
      items: [
        { productId: products[1]?.id, name: products[1]?.name || 'L\'Avenue Matcha', price: products[1]?.price || 1800, quantity: 1 },
        { productId: products[8]?.id, name: products[8]?.name || 'Waffle fruits', price: products[8]?.price || 3000, quantity: 1 },
      ],
    },
    {
      customerName: 'DEMO Komlan',
      phone: '+22890000003',
      fulfillment: 'DELIVERY' as const,
      deliveryAddress: '45 Avenue du 13 Janvier, Lomé',
      deliveryLandmark: 'quartier Bè',
      items: [
        { productId: products[4]?.id, name: products[4]?.name || 'Burger Avenue', price: products[4]?.price || 4500, quantity: 1 },
        { productId: products[6]?.id, name: products[6]?.name || 'Frites maison', price: products[6]?.price || 1500, quantity: 1 },
      ],
    },
    {
      customerName: 'DEMO Mina',
      phone: '+22890000004',
      fulfillment: 'DINE_IN' as const,
      tableNumber: '3',
      items: [
        { productId: products[2]?.id, name: products[2]?.name || 'L\'Avenue Mango', price: products[2]?.price || 1800, quantity: 1 },
      ],
    },
    {
      customerName: 'DEMO Yao',
      phone: '+22890000005',
      fulfillment: 'DELIVERY' as const,
      deliveryAddress: '8 Boulevard du Mono, Lomé',
      deliveryLandmark: 'devant l\'hôtel',
      customerNote: 'Sonnette cassée, appeler à l\'arrivée',
      deliveryFee: 700,
      items: [
        { productId: products[3]?.id, name: products[3]?.name || 'Jus d\'orange frais', price: products[3]?.price || 1500, quantity: 3 },
        { productId: products[9]?.id, name: products[9]?.name || 'Brownie', price: products[9]?.price || 2000, quantity: 2 },
      ],
    },
  ];

  const statuses = ['pending', 'preparing', 'ready', 'completed'];

  for (let i = 0; i < demoOrders.length; i++) {
    const orderData = demoOrders[i];
    const status = statuses[i % statuses.length];
    const now = new Date();
    const createdAt = new Date(now.getTime() - (i * 15 * 60 * 1000)); // Chaque commande toutes les 15 min

    const total = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (orderData.deliveryFee || 0);

    const order = await prisma.order.create({
      data: {
        total,
        status,
        source: 'online',
        customerName: orderData.customerName,
        phone: orderData.phone,
        fulfillment: orderData.fulfillment,
        deliveryAddress: orderData.deliveryAddress,
        deliveryLandmark: orderData.deliveryLandmark,
        customerNote: orderData.customerNote,
        deliveryFee: orderData.deliveryFee,
        createdAt,
        items: {
          create: orderData.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
        events: {
          create: {
            type: 'CREATED',
            note: 'Commande de démonstration',
          },
        },
      },
    });

    console.log(`✅ Commande DEMO créée: ${order.id.slice(-4)} - ${orderData.customerName}`);
  }

  console.log('✅ Commandes de démonstration créées avec succès');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
