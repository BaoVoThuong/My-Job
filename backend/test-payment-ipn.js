/**
 * Test script to simulate MoMo IPN callback
 * This helps you test the payment flow without actually scanning QR codes
 *
 * Usage:
 * 1. Make sure backend is running
 * 2. Create a payment order by clicking "Buy Now" on the subscription page
 * 3. Note the ORDER ID from the console logs (e.g., "ORDER_2_1766667411205")
 * 4. Run: node backend/test-payment-ipn.js ORDER_2_1766667411205
 */

const axios = require('axios');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('❌ Usage: node test-payment-ipn.js <orderId>');
  console.log('Example: node test-payment-ipn.js ORDER_2_1766667411205');
  process.exit(1);
}

const orderId = args[0];

async function testIPN() {
  try {
    console.log('🧪 Testing IPN callback for order:', orderId);

    const ipnPayload = {
      partnerCode: 'MOMO',
      orderId: orderId,
      requestId: `REQ_${Date.now()}`,
      amount: '100000',
      orderInfo: 'Upgrade subscription',
      orderType: 'momo_wallet',
      transId: `TEST_TRANS_${Date.now()}`,
      resultCode: 0, // 0 = success
      message: 'Successful.',
      payType: 'qr',
      responseTime: Date.now(),
      extraData: '',
      signature: 'test_signature'
    };

    console.log('📤 Sending IPN payload:', ipnPayload);

    const response = await axios.post('http://localhost:5000/api/payments/momo/ipn', ipnPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ IPN Response:', response.data);
    console.log('\n🎉 Payment simulation successful!');
    console.log('👉 Check your database to verify:');
    console.log('   - Order status should be PAID');
    console.log('   - Job quota should be added');
    console.log('   - User subscription should be created');

  } catch (error) {
    console.error('❌ IPN Test Failed:');
    if (error.response) {
      console.error('Response:', error.response.data);
      console.error('Status:', error.response.status);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testIPN();
