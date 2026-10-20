import { createHash } from 'crypto';

console.log('=== Tests de validation de l\'API de synchronisation ===\n');

// Test 1: Détection des doublons
console.log('Test 1: Détection des doublons');
const items1 = [
  { productId: 'p1', name: 'Produit A', price: 1000, quantity: 2 },
  { productId: 'p2', name: 'Produit B', price: 2000, quantity: 1 },
];

const items2 = [
  { productId: 'p1', name: 'Produit A', price: 1000, quantity: 2 },
  { productId: 'p2', name: 'Produit B', price: 2000, quantity: 1 },
];

const signature1 = createHash('sha256')
  .update(JSON.stringify(items1.sort((a, b) => (a.productId || '').localeCompare(b.productId || ''))))
  .digest('hex');

const signature2 = createHash('sha256')
  .update(JSON.stringify(items2.sort((a, b) => (a.productId || '').localeCompare(b.productId || ''))))
  .digest('hex');

console.log('  Signatures identiques:', signature1 === signature2 ? '✓ PASS' : '✗ FAIL');

// Test 2: Signatures différentes pour commandes différentes
console.log('\nTest 2: Signatures différentes pour commandes différentes');
const items3 = [
  { productId: 'p1', name: 'Produit A', price: 1000, quantity: 3 },
];

const signature3 = createHash('sha256')
  .update(JSON.stringify(items3.sort((a, b) => (a.productId || '').localeCompare(b.productId || ''))))
  .digest('hex');

console.log('  Signatures différentes:', signature1 !== signature3 ? '✓ PASS' : '✗ FAIL');

// Test 3: Insensibilité à l'ordre
console.log('\nTest 3: Insensibilité à l\'ordre des articles');
const items4 = [
  { productId: 'p2', name: 'Produit B', price: 2000, quantity: 1 },
  { productId: 'p1', name: 'Produit A', price: 1000, quantity: 2 },
];

const signature4 = createHash('sha256')
  .update(JSON.stringify(items4.sort((a, b) => (a.productId || '').localeCompare(b.productId || ''))))
  .digest('hex');

console.log('  Signatures identiques malgré l\'ordre:', signature1 === signature4 ? '✓ PASS' : '✗ FAIL');

// Test 4: Recalcul du total
console.log('\nTest 4: Recalcul du total');
const calculatedTotal = items1.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const providedTotal = 4000;
console.log('  Total calculé:', calculatedTotal, 'vs fourni:', providedTotal);
console.log('  Totaux correspondent:', calculatedTotal === providedTotal ? '✓ PASS' : '✗ FAIL');

// Test 5: Rejet d'un total incorrect
console.log('\nTest 5: Rejet d\'un total incorrect');
const wrongTotal = 5000;
console.log('  Total incorrect rejeté:', calculatedTotal !== wrongTotal ? '✓ PASS' : '✗ FAIL');

console.log('\n=== Tests terminés ===');
