// Test script cho API orders
const BASE_URL = "http://localhost:3000";

async function testOrderAPI() {
  console.log("🧪 Testing Order API...\n");

  // Test 1: Get order 111
  console.log("1. Testing GET /api/orders/111");
  try {
    const response = await fetch(`${BASE_URL}/api/orders/111`);
    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Get all orders để xem có orders nào
  console.log("2. Testing GET /api/orders (list all orders)");
  try {
    const response = await fetch(`${BASE_URL}/api/orders`);
    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));
    
    if (data.success && data.orders && data.orders.length > 0) {
      console.log(`\n   📋 Found ${data.orders.length} orders:`);
      data.orders.slice(0, 3).forEach(order => {
        console.log(`     - Order #${order.id}: ${order.status} (${order.payment_status})`);
      });
    }
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Simulate payment for order 111 (nếu tồn tại)
  console.log("3. Testing POST /api/vnpay/simulate-payment");
  try {
    const response = await fetch(`${BASE_URL}/api/vnpay/simulate-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: '111',
        status: 'paid'
      })
    });
    const data = await response.json();
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log("\n✅ Test completed!");
}

// Chạy test
testOrderAPI().catch(console.error); 