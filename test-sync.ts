const testOrder = {
  items: [
    {
      productId: "test-product-1",
      name: "Café test",
      price: 500,
      quantity: 2
    }
  ],
  total: 1000
};

async function testSync() {
  console.log('Test 1: Création d\'une commande valide');
  try {
    const response = await fetch('http://localhost:3000/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (response.status === 201) {
      console.log('✅ Test 1 réussi: commande créée');
    } else {
      console.log('❌ Test 1 échoué');
    }
  } catch (error) {
    console.error('❌ Test 1 erreur:', error);
  }

  console.log('\nTest 2: Tentative de doublon (même commande)');
  try {
    const response = await fetch('http://localhost:3000/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (response.status === 409) {
      console.log('✅ Test 2 réussi: doublon détecté');
    } else {
      console.log('❌ Test 2 échoué: doublon non détecté');
    }
  } catch (error) {
    console.error('❌ Test 2 erreur:', error);
  }

  console.log('\nTest 3: Total incorrect');
  try {
    const invalidOrder = {
      items: [
        {
          productId: "test-product-2",
          name: "Café test 2",
          price: 500,
          quantity: 2
        }
      ],
      total: 1500 // Total incorrect (devrait être 1000)
    };

    const response = await fetch('http://localhost:3000/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidOrder),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    if (response.status === 400) {
      console.log('✅ Test 3 réussi: total incorrect rejeté');
    } else {
      console.log('❌ Test 3 échoué');
    }
  } catch (error) {
    console.error('❌ Test 3 erreur:', error);
  }
}

testSync();
