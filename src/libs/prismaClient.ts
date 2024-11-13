import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({ log: [{ level: 'info', emit: 'stdout' }, { level:'query', emit: 'stdout' }] });

export { prismaClient };