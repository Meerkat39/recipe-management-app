import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// globalThis.prismaが存在すればそれを使い、なければ新しいインスタンスを生成
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// 開発環境でのみ、生成したインスタンスをグローバルに保持する
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;