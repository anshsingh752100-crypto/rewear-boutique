import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // On Vercel or AWS Lambda, SQLite needs to live in /tmp to be writable
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless) {
    const tmpDbPath = path.join('/tmp', 'dev.db');

    try {
      if (!fs.existsSync(tmpDbPath)) {
        const potentialSources = [
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.join(process.cwd(), 'public', 'dev.db'),
          path.join(process.cwd(), 'src', 'lib', 'dev.db'),
          path.resolve(__dirname, '..', '..', 'prisma', 'dev.db'),
          path.resolve(__dirname, '..', 'prisma', 'dev.db'),
          path.resolve(__dirname, 'dev.db'),
          '/var/task/prisma/dev.db',
          '/var/task/public/dev.db',
          '/var/task/src/lib/dev.db',
        ];

        let copied = false;
        for (const src of potentialSources) {
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, tmpDbPath);
            copied = true;
            console.log(`[Prisma] Successfully initialized SQLite db at /tmp/dev.db from ${src}`);
            break;
          }
        }

        if (!copied) {
          console.warn('[Prisma] Could not find source dev.db to copy to /tmp');
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (err) {
      console.error('[Prisma] Error setting up /tmp SQLite db:', err);
    }
  }

  return envUrl || 'file:./dev.db';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
