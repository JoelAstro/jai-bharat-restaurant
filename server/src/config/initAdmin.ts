import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

/**
 * Ensures an administrator account exists matching the configured server-side admin settings,
 * updating any existing admin account without creating duplicate accounts.
 */
export async function ensureAdminAccount() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'joelramireddy@gmail.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Joel@2007';
  const adminName = process.env.ADMIN_NAME || 'Joel Ramireddy';
  const adminPhone = process.env.ADMIN_PHONE || '9876543210';

  try {
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // 1. Check if an admin with the exact target email already exists
    const existingByEmail = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingByEmail) {
      await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          role: 'ADMIN',
          passwordHash,
          name: adminName,
        },
      });
      console.log(`[Admin Init] Verified and updated admin credentials for ${adminEmail}`);
      return;
    }

    // 2. Check if an admin account already exists with another email (e.g. initial seeded admin)
    const existingAdminRole = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdminRole) {
      await prisma.user.update({
        where: { id: existingAdminRole.id },
        data: {
          email: adminEmail,
          passwordHash,
          name: adminName,
          phone: adminPhone,
          role: 'ADMIN',
        },
      });
      console.log(
        `[Admin Init] Safely updated existing admin account (ID: ${existingAdminRole.id}) to ${adminEmail}`
      );
      return;
    }

    // 3. If no admin account exists in database, create one
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: adminName,
        phone: adminPhone,
        role: 'ADMIN',
      },
    });
    console.log(`[Admin Init] Created primary admin account for ${adminEmail}`);
  } catch (err: any) {
    console.error('[Admin Init] Error syncing admin account:', err.message);
  }
}
