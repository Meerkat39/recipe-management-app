import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.recipe.create({
    data: {
      title: "チャーハン",
      description: "基本的なチャーハンです",
      cookingTimeMinutes: 15,
      servings: 2,
      instructions: JSON.stringify([
        "卵を溶く",
        "フライパンを熱する",
        "ご飯を炒める",
        "調味料を加える",
      ]),
      ingredients: {
        create: [
          { name: "ご飯", amount: "300", unit: "g" },
          { name: "卵", amount: "2", unit: "個" },
          { name: "醤油", amount: "大さじ1", unit: "" },
          { name: "長ねぎ", amount: "1/2", unit: "本" },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
