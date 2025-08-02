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
    // ここで関数を閉じるだけ
  });

  await prisma.recipe.create({
    data: {
      title: "トマトパスタ",
      description: "シンプルなトマトソースのパスタ。",
      cookingTimeMinutes: 20,
      servings: 2,
      instructions: JSON.stringify([
        "パスタを茹でる",
        "トマトソースを作る",
        "パスタとソースを和える",
      ]),
      ingredients: {
        create: [
          { name: "パスタ", amount: "200", unit: "g" },
          { name: "トマト缶", amount: "1", unit: "缶" },
          { name: "オリーブオイル", amount: "2", unit: "大さじ" },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      title: "親子丼",
      description: "鶏肉と卵の定番丼もの。",
      cookingTimeMinutes: 15,
      servings: 2,
      instructions: JSON.stringify([
        "鶏肉を炒める",
        "だしで煮る",
        "卵でとじる",
        "ご飯にのせる",
      ]),
      ingredients: {
        create: [
          { name: "鶏もも肉", amount: "150", unit: "g" },
          { name: "卵", amount: "2", unit: "個" },
          { name: "玉ねぎ", amount: "1/2", unit: "個" },
          { name: "ご飯", amount: "2", unit: "杯" },
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
