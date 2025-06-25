const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testErrorMessages() {
    console.log('🧪 Testing Error Messages User-Friendly\n');

    const tests = [
        {
            name: '🔐 Test Login - Empty Fields',
            url: `${BASE_URL}/api/auth/login`,
            method: 'POST',
            body: { username: '', password: '' },
            expectedStatus: 400,
            expectedMessage: 'Vui lòng nhập email'
        },
        {
            name: '🔐 Test Login - Email Not Exists',
            url: `${BASE_URL}/api/auth/login`,
            method: 'POST',
            body: { username: 'notexists@email.com', password: 'anypass' },
            expectedStatus: 404,
            expectedMessage: 'Email này chưa được đăng ký'
        },
        {
            name: '🔐 Test Login - Wrong Password',
            url: `${BASE_URL}/api/auth/login`,
            method: 'POST',
            body: { username: 'gearhub@admin.com', password: 'wrongpass' },
            expectedStatus: 401,
            expectedMessage: 'Mật khẩu không đúng'
        },
        {
            name: '📝 Test Register - Empty Email',
            url: `${BASE_URL}/api/auth/register`,
            method: 'POST',
            body: { fullName: 'Test User', email: '', password: '123456a' },
            expectedStatus: 400,
            expectedMessage: 'Vui lòng nhập email'
        },
        {
            name: '📝 Test Register - Invalid Email',
            url: `${BASE_URL}/api/auth/register`,
            method: 'POST',
            body: { fullName: 'Test User', email: 'invalid-email', password: '123456a' },
            expectedStatus: 400,
            expectedMessage: 'Email không hợp lệ'
        },
        {
            name: '📝 Test Register - Duplicate Email',
            url: `${BASE_URL}/api/auth/register`,
            method: 'POST',
            body: { fullName: 'Test User', email: 'gearhub@admin.com', password: '123456a' },
            expectedStatus: 409,
            expectedMessage: 'Email đã được sử dụng'
        },
        {
            name: '📦 Test Product - Invalid Price',
            url: `${BASE_URL}/api/products`,
            method: 'POST',
            body: { product_name: 'Test Product', product_code: 'TEST001', price: -100 },
            expectedStatus: 400,
            expectedMessage: 'Giá phải lớn hơn 0'
        },
        {
            name: '📦 Test Product - Missing Fields',
            url: `${BASE_URL}/api/products`,
            method: 'POST',
            body: { product_name: '', product_code: '', price: null },
            expectedStatus: 400,
            expectedMessage: 'Tên sản phẩm, mã sản phẩm và giá là bắt buộc'
        },
        {
            name: '📦 Test Product - Not Found',
            url: `${BASE_URL}/api/products/99999`,
            method: 'GET',
            body: null,
            expectedStatus: 404,
            expectedMessage: 'Không tìm thấy sản phẩm'
        }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
        try {
            console.log(`\n${test.name}`);
            console.log('─'.repeat(50));

            const options = {
                method: test.method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (test.body) {
                options.body = JSON.stringify(test.body);
            }

            const response = await fetch(test.url, options);
            const result = await response.json();

            console.log('📤 Request:', test.method, test.url.replace(BASE_URL, ''));
            if (test.body) {
                console.log('📤 Body:', JSON.stringify(test.body, null, 2));
            }
            console.log('📥 Status:', response.status);
            console.log('📥 Response:', JSON.stringify(result, null, 2));

            // Check status
            const statusMatch = response.status === test.expectedStatus;
            console.log(`✅ Status Check: ${statusMatch ? 'PASS' : 'FAIL'} (Expected: ${test.expectedStatus}, Got: ${response.status})`);

            // Check message
            const messageMatch = result.message === test.expectedMessage;
            console.log(`✅ Message Check: ${messageMatch ? 'PASS' : 'FAIL'}`);
            console.log(`   Expected: "${test.expectedMessage}"`);
            console.log(`   Got: "${result.message}"`);

            // Check user-friendly (no technical details)
            const noTechnicalDetails = !result.message?.includes('Error:') &&
                !result.message?.includes('undefined') &&
                !result.message?.includes('null') &&
                !result.message?.includes('database') &&
                !result.message?.includes('SQL');
            console.log(`✅ User-Friendly: ${noTechnicalDetails ? 'PASS' : 'FAIL'} (No technical details exposed)`);

            if (statusMatch && messageMatch && noTechnicalDetails) {
                passedTests++;
                console.log('🎉 Test Result: PASS');
            } else {
                console.log('❌ Test Result: FAIL');
            }

        } catch (error) {
            console.log('💥 Error running test:', error.message);
            console.log('❌ Test Result: ERROR');
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Error messages are user-friendly ✨');
    } else {
        console.log('⚠️  Some tests failed. Review error messages above.');
    }
}

testErrorMessages().catch(console.error); 