import React from "react";

export interface HeaderProps {
  title?: string;
}

/**
 * アプリのヘッダーコンポーネント。
 * ナビゲーションメニューも含む。
 */
export const Header: React.FC<HeaderProps> = ({
  title = "レシピ管理システム",
}) => {
  return (
    <header className="bg-gray-800 text-white px-8 py-4 flex items-center justify-between shadow">
      <div className="font-bold text-xl flex items-center gap-2">
        <span role="img" aria-label="logo">
          🍳
        </span>{" "}
        {title}
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
  );
};
