
// In development, the command next dev clears Node.js cache on run. 
// This in turn initializes a new PrismaClient instance each time due to hot 
// reloading that creates a connection to the database. This can quickly exhaust 
// the database connections as each PrismaClient instance holds its own connection 
// pool.development, the command next dev clears Node.js cache on run. This in 
// turn initializes a new PrismaClient instance each time due to hot reloading 
// that creates a connection to the database. This can quickly exhaust the database 
// connections as each PrismaClient instance holds its own connection pool.

// The solution in this case is to instantiate a single instance PrismaClient and save 
// it on the globalThis object. Then we keep a check to only instantiate PrismaClient if 
// it's not on the globalThis object otherwise use the same instance again if already
// present to prevent instantiating extra PrismaClient instances.

// learn more at https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma