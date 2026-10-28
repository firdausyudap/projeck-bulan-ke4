import { prisma } from "../src/utils/prisma";

beforeAll(async () => {
  // Ensure database connection
});

afterAll(async () => {
  await prisma.$disconnect();
});
