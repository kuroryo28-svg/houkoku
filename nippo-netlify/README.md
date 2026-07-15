# 業務日誌 (nippo)

日報を一度書けば、週報・月報・粗利が自動で束ねられる業務日誌アプリ。

## デプロイ手順

### A. ドラッグ&ドロップ（最速）
1. このフォルダごと Netlify の Deploys 画面にドロップ
2. これだけで日報・週報・月報・経費・粗利計算・バックアップは全部動く

### B. AI週報生成も使う場合（要APIキー）
1. Netlify管理画面 → Site configuration → Environment variables
2. `ANTHROPIC_API_KEY` に Anthropic のAPIキーを設定
3. 再デプロイ

※APIキー未設定でもAI以外の機能はすべて動作します

## データについて
- データはブラウザの localStorage に保存（端末内・外部送信なし）
- 端末やブラウザを変えると見えないので、ヘッダーの「書き出し」で
  定期的にJSONバックアップを取ることを推奨
- 「読み込み」でバックアップから復元可能

## 構成
- index.html … アプリ本体（React UMD + Babel standalone、ビルド不要）
- netlify/functions/generate-report.js … AI生成用Function（APIキーはサーバー側）
- netlify.toml … Functions設定
