import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Header } from "../components/ui/Header";
import { Input } from "../components/ui/Input";
import { Layout } from "../components/ui/Layout";
import { Loading } from "../components/ui/Loading";

export default function Home() {
  return (
    <Layout>
      <Header />
      <div className="space-y-8">
        <h1 className="text-2xl font-bold mb-4">UIコンポーネント サンプル</h1>
        <Card>
          <h2 className="text-xl font-semibold mb-2">Cardコンポーネント</h2>
          <p>これはCardコンポーネントのサンプルです。</p>
        </Card>
        <div className="flex gap-4">
          <Button>通常ボタン</Button>
          <Button variant="primary">プライマリ</Button>
          <Button variant="secondary">セカンダリ</Button>
        </div>
        <div className="mt-4">
          <Input label="テキスト入力" placeholder="入力してください" />
        </div>
        <div className="mt-4">
          <Loading />
        </div>
        <div className="mt-4">
          <ErrorMessage message="エラーが発生しました。" />
        </div>
      </div>
    </Layout>
  );
}
