#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user } from '../lib/db/schema';
import { hash } from 'bcrypt-ts';

const POSTGRES_URL = process.env.POSTGRES_URL || 'postgresql://myuser:mypassword@localhost:5432/mydb';

async function createAdminUser() {
  const connection = postgres(POSTGRES_URL);
  const db = drizzle(connection);

  try {
    // Hash the password
    const hashedPassword = await hash('admin123', 10);

    // Create the admin user
    const newUser = await db.insert(user).values({
      name: 'Admin User',
      email: 'admin@darkalphaqa.com',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    }).returning();

    console.log('✅ Admin user created successfully:');
    console.log(`   Email: admin@darkalphaqa.com`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ADMIN`);
    console.log(`   User ID: ${newUser[0].id}`);

    await connection.end();
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    await connection.end();
    process.exit(1);
  }
}

createAdminUser();