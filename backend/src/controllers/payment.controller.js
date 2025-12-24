<<<<<<< HEAD
const crypto = require("crypto");
const axios = require("axios");
const db = require("../config/db");

exports.createMomoPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan_id } = req.body;

    // 1️⃣ Get plan
    const planRes = await db.query(
      `SELECT * FROM subscription_plans WHERE id = $1`,
      [plan_id]
    );

    const plan = planRes.rows[0];
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // 2️⃣ Create order
    const orderRes = await db.query(
      `INSERT INTO orders (user_id, plan_id, amount, payment_method, status)
       VALUES ($1, $2, $3, 'momo', 'PENDING')
       RETURNING *`,
      [userId, plan.id, plan.price]
    );

    const order = orderRes.rows[0];

    // 3️⃣ Build MoMo payload
    const orderId = `ORDER_${order.id}_${Date.now()}`;
    const requestId = `REQ_${Date.now()}`;

    const amount = Math.round(Number(plan.price)).toString();
    const orderInfo = "Upgrade subscription";
    const extraData = "";
    const requestType = "captureWallet";

    const rawSignature =
      `accessKey=${process.env.MOMO_ACCESS_KEY}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${process.env.MOMO_NOTIFY_URL}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${process.env.MOMO_PARTNER_CODE}` +
      `&redirectUrl=${process.env.MOMO_RETURN_URL}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", process.env.MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest("hex");

    const momoRequest = {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      accessKey: process.env.MOMO_ACCESS_KEY,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: process.env.MOMO_RETURN_URL,
      ipnUrl: process.env.MOMO_NOTIFY_URL,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    console.log("MoMo payload:", momoRequest);

    const momoRes = await axios.post(process.env.MOMO_ENDPOINT, momoRequest, {
      timeout: 10000,
    });

    return res.json({
      payUrl: momoRes.data.payUrl,
    });
  } catch (err) {
    console.error("MoMo error:", err.response?.data || err.message);
    return res.status(500).json({
      message: "Create MoMo payment failed",
      error: err.response?.data || err.message,
    });
  }
};

exports.momoIPN = async (req, res) => {
  try {
    console.log("🔥 MOMO IPN BODY:", req.body);

    const { resultCode, orderId, transId } = req.body;

    // 1️⃣ Validate bắt buộc
    if (!orderId) {
      console.error("❌ Missing orderId in IPN");
      return res.status(400).json({ message: "orderId missing" });
    }

    const orderIdParts = orderId.split("_");
    if (orderIdParts.length < 2) {
      console.error("❌ Invalid orderId format:", orderId);
      return res.status(400).json({ message: "Invalid orderId format" });
    }

    const orderDbId = orderIdParts[1];

    // 2️⃣ Nếu thanh toán thất bại
    if (Number(resultCode) !== 0) {
      await db.query(`UPDATE orders SET status = 'FAILED' WHERE id = $1`, [
        orderDbId,
      ]);
      return res.json({ message: "Payment failed" });
    }

    // 3️⃣ Update order → PAID
    const orderRes = await db.query(
      `UPDATE orders
       SET status = 'PAID', momo_trans_id = $1
       WHERE id = $2
       RETURNING *`,
      [transId, orderDbId]
    );

    if (orderRes.rows.length === 0) {
      console.error("Order not found:", orderDbId);
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRes.rows[0];

    // 4️⃣ Deactivate old subscription
    await db.query(
      `UPDATE user_subscriptions
       SET is_active = false
       WHERE user_id = $1 AND is_active = true`,
      [order.user_id]
    );

    // 5️⃣ Get plan
    const planRes = await db.query(
      `SELECT * FROM subscription_plans WHERE id = $1`,
      [order.plan_id]
    );

    if (planRes.rows.length === 0) {
      console.error("Subscription plan not found:", order.plan_id);
      return res.status(404).json({ message: "Plan not found" });
    }

    const plan = planRes.rows[0];

    // 6️⃣ Activate new subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration_months);

    await db.query(
      `INSERT INTO user_subscriptions
       (user_id, plan_id, start_date, end_date)
       VALUES ($1, $2, $3, $4)`,
      [order.user_id, plan.id, startDate, endDate]
    );

    console.log("Payment success for order:", orderDbId);
    res.json({ message: "Payment success" });
  } catch (err) {
    console.error("MOMO IPN ERROR:", err);
    res.status(500).json({ message: "IPN processing error" });
  }
};
=======
const crypto = require("crypto");
const axios = require("axios");
const db = require("../config/db");

exports.createMomoPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan_id } = req.body;

    // 1️⃣ Get plan
    const planRes = await db.query(
      `SELECT * FROM subscription_plans WHERE id = $1`,
      [plan_id]
    );

    const plan = planRes.rows[0];
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // 2️⃣ Create order
    const orderRes = await db.query(
      `INSERT INTO orders (user_id, plan_id, amount, payment_method, status)
       VALUES ($1, $2, $3, 'momo', 'PENDING')
       RETURNING *`,
      [userId, plan.id, plan.price]
    );

    const order = orderRes.rows[0];

    // 3️⃣ Build MoMo payload
    const orderId = `ORDER_${order.id}_${Date.now()}`;
    const requestId = `REQ_${Date.now()}`;

    const amount = Math.round(Number(plan.price)).toString();
    const orderInfo = "Upgrade subscription";
    const extraData = "";
    const requestType = "captureWallet";

    const rawSignature =
      `accessKey=${process.env.MOMO_ACCESS_KEY}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${process.env.MOMO_NOTIFY_URL}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${process.env.MOMO_PARTNER_CODE}` +
      `&redirectUrl=${process.env.MOMO_RETURN_URL}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", process.env.MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest("hex");

    const momoRequest = {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      accessKey: process.env.MOMO_ACCESS_KEY,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: process.env.MOMO_RETURN_URL,
      ipnUrl: process.env.MOMO_NOTIFY_URL,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    console.log("MoMo payload:", momoRequest);

    const momoRes = await axios.post(process.env.MOMO_ENDPOINT, momoRequest, {
      timeout: 10000,
    });

    return res.json({
      payUrl: momoRes.data.payUrl,
    });
  } catch (err) {
    console.error("MoMo error:", err.response?.data || err.message);
    return res.status(500).json({
      message: "Create MoMo payment failed",
      error: err.response?.data || err.message,
    });
  }
};

exports.momoIPN = async (req, res) => {
  try {
    console.log("🔥 MOMO IPN BODY:", req.body);

    const { resultCode, orderId, transId } = req.body;

    // 1️⃣ Validate bắt buộc
    if (!orderId) {
      console.error("❌ Missing orderId in IPN");
      return res.status(400).json({ message: "orderId missing" });
    }

    const orderIdParts = orderId.split("_");
    if (orderIdParts.length < 2) {
      console.error("❌ Invalid orderId format:", orderId);
      return res.status(400).json({ message: "Invalid orderId format" });
    }

    const orderDbId = orderIdParts[1];

    // 2️⃣ Nếu thanh toán thất bại
    if (Number(resultCode) !== 0) {
      await db.query(`UPDATE orders SET status = 'FAILED' WHERE id = $1`, [
        orderDbId,
      ]);
      return res.json({ message: "Payment failed" });
    }

    // 3️⃣ Update order → PAID
    const orderRes = await db.query(
      `UPDATE orders
       SET status = 'PAID', momo_trans_id = $1
       WHERE id = $2
       RETURNING *`,
      [transId, orderDbId]
    );

    if (orderRes.rows.length === 0) {
      console.error("Order not found:", orderDbId);
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRes.rows[0];

    // 4️⃣ Deactivate old subscription
    await db.query(
      `UPDATE user_subscriptions
       SET is_active = false
       WHERE user_id = $1 AND is_active = true`,
      [order.user_id]
    );

    // 5️⃣ Get plan
    const planRes = await db.query(
      `SELECT * FROM subscription_plans WHERE id = $1`,
      [order.plan_id]
    );

    if (planRes.rows.length === 0) {
      console.error("Subscription plan not found:", order.plan_id);
      return res.status(404).json({ message: "Plan not found" });
    }

    const plan = planRes.rows[0];

    // 6️⃣ Activate new subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration_months);

    await db.query(
      `INSERT INTO user_subscriptions
       (user_id, plan_id, start_date, end_date)
       VALUES ($1, $2, $3, $4)`,
      [order.user_id, plan.id, startDate, endDate]
    );

    console.log("Payment success for order:", orderDbId);
    res.json({ message: "Payment success" });
  } catch (err) {
    console.error("MOMO IPN ERROR:", err);
    res.status(500).json({ message: "IPN processing error" });
  }
};
>>>>>>> d8f4b6dd27e42e2420908d9b3678d12ab3e9cb81
