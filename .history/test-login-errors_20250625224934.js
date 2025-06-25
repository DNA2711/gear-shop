// Test script để kiểm tra thông báo lỗi đăng nhập
async function testLoginErrors() {
  console.log("Testing login error messages...\n");

  // Test 1: Email không tồn tại
  console.log("1. Testing with non-existent email:");
  try {
    const response1 = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "nonexistent@email.com",
        password: "123456a"
      }),
    });
    
    const result1 = await response1.json();
    console.log(`Status: ${response1.status}`);
    console.log(`Message: ${result1.message}`);
    console.log("");
  } catch (error) {
    console.log("Error:", error.message);
    console.log("");
  }

  // Test 2: Email đúng nhưng mật khẩu sai
  console.log("2. Testing with correct email but wrong password:");
  try {
    const response2 = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "gearhub@admin.com",
        password: "wrongpassword"
      }),
    });
    
    const result2 = await response2.json();
    console.log(`Status: ${response2.status}`);
    console.log(`Message: ${result2.message}`);
    console.log("");
  } catch (error) {
    console.log("Error:", error.message);
    console.log("");
  }

  // Test 3: Thông tin đúng (để kiểm tra)
  console.log("3. Testing with correct credentials:");
  try {
    const response3 = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "gearhub@admin.com",
        password: "123456a"
      }),
    });
    
    const result3 = await response3.json();
    console.log(`Status: ${response3.status}`);
    console.log(`Message: ${result3.message || "Login successful"}`);
    console.log("");
  } catch (error) {
    console.log("Error:", error.message);
    console.log("");
  }
}

testLoginErrors().catch(console.error); 