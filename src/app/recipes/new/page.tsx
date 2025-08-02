"use client";
import { createRecipeAction } from "@/app/actions/recipes";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Layout } from "../../../components/ui/Layout";

export default function NewRecipePage() {
  "use client";
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(formData: FormData) {
    const result = await createRecipeAction(formData);
    if (result?.error) {
      // Zodバリデーションエラーの場合は details を各フィールドごとにまとめる
      if (result.details) {
        const fieldErrors: Record<string, string> = {};
        result.details.forEach((issue) => {
          if (
            issue.path.length > 0 &&
            (typeof issue.path[0] === "string" ||
              typeof issue.path[0] === "number")
          ) {
            fieldErrors[String(issue.path[0])] = issue.message;
          }
        });
        setErrors({ global: result.error, ...fieldErrors });
      } else {
        setErrors({ global: result.error });
      }
    } else {
      setErrors({});
    }
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-indigo-700">
              新規レシピ作成
            </h2>
            <Link href="/recipes" passHref>
              <Button variant="secondary">一覧へ戻る</Button>
            </Link>
          </div>
          {errors.global && (
            <div className="text-red-600 text-sm mb-2">{errors.global}</div>
          )}
          <form action={handleSubmit} className="space-y-4">
            <Input
              label="タイトル"
              name="title"
              required
              className="text-gray-900"
            />
            {errors.title && (
              <div className="text-red-600 text-xs">{errors.title}</div>
            )}
            <Input label="説明" name="description" className="text-gray-900" />
            {errors.description && (
              <div className="text-red-600 text-xs">{errors.description}</div>
            )}
            <Input
              label="調理時間（分）"
              name="cookingTimeMinutes"
              type="number"
              required
              className="text-gray-900"
            />
            {errors.cookingTimeMinutes && (
              <div className="text-red-600 text-xs">
                {errors.cookingTimeMinutes}
              </div>
            )}
            <Input
              label="人数"
              name="servings"
              type="number"
              required
              className="text-gray-900"
            />
            {errors.servings && (
              <div className="text-red-600 text-xs">{errors.servings}</div>
            )}
            <Input
              label="材料（JSON配列）"
              name="ingredients"
              required
              className="text-gray-900"
            />
            {errors.ingredients && (
              <div className="text-red-600 text-xs">{errors.ingredients}</div>
            )}
            <Input
              label="手順（JSON配列）"
              name="instructions"
              required
              className="text-gray-900"
            />
            {errors.instructions && (
              <div className="text-red-600 text-xs">{errors.instructions}</div>
            )}
            <Button type="submit">作成</Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
