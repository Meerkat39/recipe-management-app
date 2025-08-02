import Link from "next/link";
import React from "react";

export interface LayoutProps {
  children: React.ReactNode;
}

/**
 * アプリ全体のレイアウトコンポーネント。
 * ヘッダー・サイドバー・メインコンテンツ領域を配置。
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <header className="bg-gray-800 text-white px-8 py-4 flex items-center justify-between shadow">
        <div className="font-bold text-xl flex items-center gap-2">
          <span role="img" aria-label="logo">
            🍳
          </span>{" "}
          レシピ管理システム
        </div>
        {/* ヘッダーのナビゲーションは削除 */}
      </header>
      <div className="flex">
        {/* サイドバー */}
        <aside className="w-64 bg-gray-900 text-white min-h-[calc(100vh-64px)] p-6">
          <ul className="space-y-4">
            <li>
              <Link
                href="/recipes"
                className="flex items-center gap-2 hover:text-indigo-300"
              >
                <span>📝</span>レシピ一覧
              </Link>
            </li>
            <li>
              <Link
                href="/recipes/new"
                className="flex items-center gap-2 hover:text-indigo-300"
              >
                <span>➕</span>新規作成
              </Link>
            </li>
          </ul>
        </aside>
        {/* メインコンテンツ */}
        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
};
