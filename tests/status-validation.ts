console.log('=== Tests de validation des transitions de statut ===\n');

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['preparing'],
  preparing: ['ready'],
  ready: ['completed'],
  completed: [],
};

function isValidTransition(currentStatus: string, newStatus: string): boolean {
  const validTransitions = VALID_TRANSITIONS[currentStatus] || [];
  return validTransitions.includes(newStatus);
}

// Test 1: Transition valide pending -> preparing
console.log('Test 1: Transition pending -> preparing');
console.log('  Transition valide:', isValidTransition('pending', 'preparing') ? '✓ PASS' : '✗ FAIL');

// Test 2: Transition valide preparing -> ready
console.log('\nTest 2: Transition preparing -> ready');
console.log('  Transition valide:', isValidTransition('preparing', 'ready') ? '✓ PASS' : '✗ FAIL');

// Test 3: Transition valide ready -> completed
console.log('\nTest 3: Transition ready -> completed');
console.log('  Transition valide:', isValidTransition('ready', 'completed') ? '✓ PASS' : '✗ FAIL');

// Test 4: Rejet transition invalide pending -> ready
console.log('\nTest 4: Rejet transition invalide pending -> ready');
console.log('  Transition rejetée:', !isValidTransition('pending', 'ready') ? '✓ PASS' : '✗ FAIL');

// Test 5: Rejet transition depuis completed
console.log('\nTest 5: Rejet transition depuis completed');
console.log('  Transition rejetée:', !isValidTransition('completed', 'pending') ? '✓ PASS' : '✗ FAIL');

// Test 6: Rejet transition vers pending depuis preparing
console.log('\nTest 6: Rejet transition preparing -> pending');
console.log('  Transition rejetée:', !isValidTransition('preparing', 'pending') ? '✓ PASS' : '✗ FAIL');

// Test 7: Rejet transition directe pending -> completed
console.log('\nTest 7: Rejet transition directe pending -> completed');
console.log('  Transition rejetée:', !isValidTransition('pending', 'completed') ? '✓ PASS' : '✗ FAIL');

console.log('\n=== Tests terminés ===');
