import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/prisma.js';
import { ensureAdminAccount } from '../src/config/initAdmin.js';

describe('Website Image Management Integration Tests', () => {
  let adminToken: string;
  let customerToken: string;
  let testImageId: string;

  beforeAll(async () => {
    // 0. Ensure admin account exists with configured password
    await ensureAdminAccount();

    // 1. Authenticate admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'joelramireddy@gmail.com', password: 'Joel@2007' });
    adminToken = adminRes.body.data.token;

    // 2. Authenticate customer
    const customerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'customer@example.com', password: 'Customer123!' });
    customerToken = customerRes.body.data.token;
  });

  afterAll(async () => {
    // Clean up test image if exists
    if (testImageId) {
      await prisma.websiteImage.deleteMany({ where: { id: testImageId } });
    }
  });

  it('GET /api/images/public should return list of public active images', async () => {
    const res = await request(app).get('/api/images/public?section=hero');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    // First item should be the default image
    expect(res.body.data[0].isDefault).toBe(true);
  });

  it('GET /api/images should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/images');
    expect(res.status).toBe(401);
  });

  it('GET /api/images should deny customer access (403)', async () => {
    const res = await request(app)
      .get('/api/images')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });

  it('GET /api/images should allow admin to view all images', async () => {
    const res = await request(app)
      .get('/api/images')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/images should allow admin to create a new website image record', async () => {
    const res = await request(app)
      .post('/api/images')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        section: 'hero',
        title: 'Special Dum Feast Test Handi',
        imageUrl: '/images/hero/test-handi.jpg',
        altText: 'Test Biryani',
        displayOrder: 99,
        isDefault: false,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Special Dum Feast Test Handi');
    testImageId = res.body.data.id;
  });

  it('PUT /api/images/:id/default should set the target image as default', async () => {
    const res = await request(app)
      .put(`/api/images/${testImageId}/default`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isDefault).toBe(true);

    // Verify other hero images had isDefault set to false
    const otherHeroes = await prisma.websiteImage.findMany({
      where: { section: 'hero', id: { not: testImageId } },
    });
    for (const hero of otherHeroes) {
      expect(hero.isDefault).toBe(false);
    }
  });

  it('PUT /api/images/reorder should reorder images', async () => {
    const res = await request(app)
      .put('/api/images/reorder')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        items: [{ id: testImageId, displayOrder: 0, isDefault: true }],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /api/images/:id should delete the image', async () => {
    const res = await request(app)
      .delete(`/api/images/${testImageId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Reset default back to hero-1
    const hero1 = await prisma.websiteImage.findFirst({
      where: { section: 'hero', imageUrl: '/images/hero/hero-1.jpg' },
    });
    if (hero1) {
      await prisma.websiteImage.update({
        where: { id: hero1.id },
        data: { isDefault: true },
      });
    }
  });
});
