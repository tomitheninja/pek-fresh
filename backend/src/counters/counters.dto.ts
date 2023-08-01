import Prisma from '@prisma/client';

export class Counter implements Prisma.Counter {
  id: number;
  createdAt: Date;
}
