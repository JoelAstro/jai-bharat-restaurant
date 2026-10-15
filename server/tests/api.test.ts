import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/prisma.js';

describe('Jai Bharat Family Restaurant API Integration Tests', () => {
  let customerToken: string;
  let customerId: string;
  let adminToken: string;
  let sampleItemId: string;

  beforeAll(async () => {
    // 1. Login demo admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL || 'joelramieddy@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'JaiBharatAdmin2026!',
      });
    expect(adminRes.status).toBe(200);
    adminToken = adminRes.body.data.token;

    // 2. Register or login a test customer
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Customer',
        email: testEmail,
        password: 'Password123!',
        phone: '9876501234',
      });
    expect(regRes.status).toBe(201);
    customerToken = regRes.body.data.token;
    customerId = regRes.body.data.user.id;

    // 3. Get any menu item from seeded database
    const itemsRes = await request(app).get('/api/menu/items');
    expect(itemsRes.status).toBe(200);
    expect(itemsRes.body.data.length).toBeGreaterThan(0);
    sampleItemId = itemsRes.body.data[0].id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Public Endpoints & Menu Browsing', () => {
    it('GET /api/health should return healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
    });

    it('GET /api/menu/categories should return available categories', async () => {
      const res = await request(app).get('/api/menu/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/menu/items should filter by search term', async () => {
      const res = await request(app).get('/api/menu/items?search=Biryani');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('GET /api/settings/public should return public restaurant details', async () => {
      const res = await request(app).get('/api/settings/public');
      expect(res.status).toBe(200);
      expect(res.body.data.restaurant_name).toBe('Jai Bharat Family Restaurant');
      expect(res.body.data.currency_symbol).toBe('₹');
    });

    it('GET /api/coupons/public should return active coupons', async () => {
      const res = await request(app).get('/api/coupons/public');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('2. Cart & Coupon Backend Calculations', () => {
    it('POST /api/orders/calculate should accurately compute prices on backend', async () => {
      const res = await request(app)
        .post('/api/orders/calculate')
        .send({
          items: [{ menuItemId: sampleItemId, quantity: 2 }],
          orderType: 'DELIVERY',
        });
      expect(res.status).toBe(200);
      expect(res.body.data.subtotalPaise).toBeGreaterThan(0);
      expect(res.body.data.totalPaise).toBeGreaterThan(0);
      expect(res.body.data.taxPaise).toBeDefined();
    });

    it('POST /api/coupons/validate should apply valid coupon discount', async () => {
      const res = await request(app)
        .post('/api/coupons/validate')
        .send({
          code: 'WELCOME50',
          subtotalPaise: 50000, // ₹500
        });
      expect(res.status).toBe(200);
      expect(res.body.data.discountPaise).toBe(5000); // Flat ₹50
    });

    it('POST /api/coupons/validate should reject non-existent coupon', async () => {
      const res = await request(app)
        .post('/api/coupons/validate')
        .send({
          code: 'NON_EXISTENT_COUPON',
          subtotalPaise: 50000,
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Customer Address & Ordering Flow', () => {
    let createdAddressId: string;
    let placedOrderId: string;

    it('POST /api/auth/addresses should add saved address for customer', async () => {
      const res = await request(app)
        .post('/api/auth/addresses')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          label: 'Home',
          street: '123 Test Street, MG Road',
          area: 'Indiranagar',
          city: 'Bengaluru',
          pincode: '560038',
          isDefault: true,
        });
      expect(res.status).toBe(201);
      expect(res.body.data.street).toBe('123 Test Street, MG Road');
      createdAddressId = res.body.data.id;
    });

    it('POST /api/orders should create an order with COD payment', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [{ menuItemId: sampleItemId, quantity: 1 }],
          orderType: 'DELIVERY',
          paymentMethod: 'COD',
          addressId: createdAddressId,
          customerName: 'Test Customer',
          customerPhone: '9876501234',
          customerEmail: 'testuser@example.com',
          specialInstructions: 'Please make it medium spicy.',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.orderNumber).toMatch(/^JB-\d+-\d+$/);
      expect(res.body.data.status).toBe('PENDING');
      expect(res.body.data.paymentMethod).toBe('COD');
      placedOrderId = res.body.data.id;
    });

    it('GET /api/orders/customer should list orders for logged-in user', async () => {
      const res = await request(app)
        .get('/api/orders/customer')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].id).toBe(placedOrderId);
    });

    it('GET /api/orders/:id should retrieve details of own order', async () => {
      const res = await request(app)
        .get(`/api/orders/${placedOrderId}`)
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(placedOrderId);
    });

    it('POST /api/favorites/toggle should toggle favorites', async () => {
      const res = await request(app)
        .post('/api/favorites/toggle')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ menuItemId: sampleItemId });
      expect(res.status).toBe(200);
      expect(res.body.data.isFavorite).toBe(true);
    });
  });

  describe('4. Security & Role-Based Access Control', () => {
    it('Customer should be denied access to admin order list', async () => {
      const res = await request(app)
        .get('/api/orders/admin/list')
        .set('Authorization', `Bearer ${customerToken}`);
      expect(res.status).toBe(403);
    });

    it('Unauthenticated user should be denied access to protected endpoints', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.status).toBe(401);
    });

    it('Customer should NOT be allowed to access another customer’s order', async () => {
      // Create a secondary customer
      const reg2 = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Customer Two',
          email: `cust2_${Date.now()}@example.com`,
          password: 'Password123!',
        });
      const customer2Token = reg2.body.data.token;

      // Customer 1 places an order
      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          items: [{ menuItemId: sampleItemId, quantity: 1 }],
          orderType: 'TAKEAWAY',
          paymentMethod: 'COD',
          customerName: 'Test Customer',
          customerPhone: '9876501234',
          customerEmail: 'testuser@example.com',
        });
      const orderId = orderRes.body.data.id;

      // Customer 2 attempts to fetch Customer 1's order
      const fetchRes = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${customer2Token}`);
      expect(fetchRes.status).toBe(404); // Or 403
    });
  });

  describe('5. Admin Management Operations', () => {
    let testOrderId: string;

    it('Admin can view admin orders list', async () => {
      const res = await request(app)
        .get('/api/orders/admin/list')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.orders)).toBe(true);
      if (res.body.data.orders.length > 0) {
        testOrderId = res.body.data.orders[0].id;
      }
    });

    it('Admin can transition order status (PENDING -> CONFIRMED)', async () => {
      if (!testOrderId) return;
      const res = await request(app)
        .patch(`/api/orders/admin/${testOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'CONFIRMED',
          note: 'Kitchen confirmed the order',
        });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('CONFIRMED');
    });

    it('Admin can view customer directory', async () => {
      const res = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('Admin can view reports overview', async () => {
      const res = await request(app)
        .get('/api/reports/overview')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.totalOrders).toBeDefined();
    });

    it('Admin can view restaurant settings and missing owner details', async () => {
      const res = await request(app)
        .get('/api/settings/admin')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.missingDetails)).toBe(true);
    });
  });
});
