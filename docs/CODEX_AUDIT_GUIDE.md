# CODEX 監査ガイド

## 目的と適用範囲
- Context Hive の codex（Vision/Requirements/Design/Rules などの基幹ドキュメントと Hub/Examples/Template 群）について、整合性・完全性・最新性・準拠性を継続的に保証することを目的とする。
- 監査パイプラインは develop ブランチでの開発時に必須チェックとして動作し、master ブランチへは PR と CI の成功後にのみマージされる。
- レポートは `/reports/codex/` に最新サマリをコミット（develop ブランチのみ）、CI では JSON/HTML/（必要に応じて PDF）をアーティファクトとして保存する。

## 監査観点
- **整合性**: 参照リンクの存在、ドキュメント間の相互参照整合、Hub/Examples/Template との依存関係。
- **最新性**: 最終更新日、TODO/FIXME の滞留、外部参照の鮮度、設定ファイルとの乖離。
- **準拠性**: `service.meta.yaml` スキーマ遵守、命名規則、必須ドキュメント/セクションの有無。
- **可読性**: 見出し階層の一貫性、目次の整備、表記ゆれや記法ルールの順守。
- **セキュリティ/コンプラ**: シークレット混入、ライセンス表記、不適切な外部引用がないか。
- **再現性**: Hub ツール群の実行再現性、読みリスト生成の成功、監査スクリプトの再現性。

## 実行手順
- **ローカル**:
  1. `python -m venv .venv && source .venv/bin/activate`
  2. `pip install -r requirements.txt`
  3. `pip install pre-commit && pre-commit install`
  4. `scripts/audit_codex.sh` を実行し、`reports/codex/` に生成される `audit.json` と `audit.html` を確認。
- **CI (GitHub Actions)**:
  - `codex_audit` ワークフローが pull request / push（develop, master）で自動実行。
  - gitleaks と監査スクリプトをセットアップし、`scripts/audit_codex.sh` を単一のジョブで実行。
  - 成果物として `reports/codex/` ディレクトリをアーティファクトにアップロード。

## 合否基準
- `ERROR` が 1 件でも存在する場合は不合格。
- `WARN` が 10 件を超えた場合は不合格。
- スタレネス検査で `ERROR` がある場合、または secrets scan のヒットがある場合は不合格。
- 必須ドキュメント (`codex_audit/config.yaml` の `required_docs`) および必須セクションが欠落している場合は不合格。
- 上記以外の `INFO` は記録のみで合否には影響しない。

## レポートの読み方と改善サイクル（Plan → Fix → Verify）
- **Plan**: `audit.html` のフィルタ（Severity/Directory）を使って優先度の高い項目から対応計画を立てる。
- **Fix**: 対応範囲のドキュメント・スクリプトを修正し、必要に応じて Hub ツールで再生成する。
- **Verify**: `scripts/audit_codex.sh` を再実行して修正内容を検証し、CI の必須チェックをパスさせる。
- レポートには責任区分（docs/hub/examples/template/services）が付与されているため、担当チームごとの改善指標として活用できる。

## よくあるNG例
- 参照リンクがリネーム後に更新されずリンク切れが発生している。
- `DESIGN` と `RULES` ドキュメント間の相互参照が片方向のみになっている。
- TODO/FIXME が長期間放置されており、ドキュメントが現実と乖離している。
- テンプレートの最新ルールがサンプル/実際のサービスに反映されていない。
- 外部引用コードにライセンス表記（出典）が記載されていない。
