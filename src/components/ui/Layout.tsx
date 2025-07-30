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
        <nav className="flex gap-6">
          <a href="#" className="hover:text-indigo-300 font-medium">
            ダッシュボード
          </a>
          <a href="#" className="hover:text-indigo-300 font-medium">
            新規作成
          </a>
          <a href="#" className="hover:text-indigo-300 font-medium">
            設定
          </a>
        </nav>
      </header>
      <div className="flex">
        {/* サイドバー */}
        <aside className="w-64 bg-gray-900 text-white min-h-[calc(100vh-64px)] p-6">
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-indigo-300"
              >
                <span>📊</span>ダッシュボード
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-indigo-300"
              >
                <span>📝</span>レシピ一覧
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-indigo-300"
              >
                <span>➕</span>新規作成
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-indigo-300"
              >
                <span>🔍</span>詳細検索
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-indigo-300"
              >
                <span>⭐</span>お気に入り
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-indigo-300"
              >
                <span>📈</span>統計
              </a>
            </li>
          </ul>
        </aside>
        {/* メインコンテンツ */}
        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
};
