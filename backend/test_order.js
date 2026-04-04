async function createOrder() {
  const payload = {
      customer: {
        firstName: 'Fetch',
        lastName: 'Test',
        email: 't@t.com',
        phone: '1',
        address: '1',
        city: '1',
        postalCode: '1',
      },
      items: [
        { productId: 'test', qty: 1 }
      ],
      total: 100,
      paymentMethod: 'Cash on Delivery',
  };

  try {
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
createOrder();
