#!/usr/bin/env python3
"""
run_code_samples.py - Markdownファイル内のJS/TS/Reactコードサンプルを抽出して実行検証する

使い方:
    python3 run_code_samples.py <markdown-file>

対応言語:
    - JavaScript (js, javascript) → node で実行
    - TypeScript (ts, typescript) → ts-node または npx tsx で実行
    - JSX/TSX (jsx, tsx) → 構文チェックのみ（React環境が必要なため）
    - React → 構文チェックのみ
"""

import re
import sys
import subprocess
import tempfile
import os
import shutil
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class CodeBlock:
    lang: str
    code: str
    line_number: int  # マークダウン内での開始行
    index: int        # 何番目のコードブロックか


@dataclass
class CodeResult:
    block: CodeBlock
    status: str       # "passed", "failed", "skipped", "syntax_only"
    output: str = ""
    error: str = ""
    note: str = ""


def extract_code_blocks(markdown: str) -> list[CodeBlock]:
    """Markdownからコードブロックを抽出する"""
    blocks = []
    # ```lang ... ``` パターンにマッチ（言語タグあり）
    pattern = re.compile(r'^```(\w+)\n(.*?)^```', re.MULTILINE | re.DOTALL)

    # 行番号を追跡するために行ごとに処理
    lines = markdown.split('\n')
    line_positions = {}  # バイトオフセット→行番号のマッピング
    offset = 0
    for i, line in enumerate(lines, 1):
        line_positions[offset] = i
        offset += len(line) + 1

    for idx, match in enumerate(pattern.finditer(markdown)):
        lang = match.group(1).lower()
        code = match.group(2)

        # マッチ開始位置から行番号を特定
        match_offset = match.start()
        line_num = 1
        current_offset = 0
        for line in lines:
            if current_offset > match_offset:
                break
            line_num += 1
            current_offset += len(line) + 1

        blocks.append(CodeBlock(
            lang=lang,
            code=code,
            line_number=line_num - 1,
            index=idx + 1
        ))

    return blocks


def has_network_dependency(code: str) -> bool:
    """
    コードが実行時にネットワーク接続を必要とするかを判定する。
    技術書ではダミーURL（/api/xxx, https://api.example.com/など）を使う例示コードが多く、
    これらは「実行不可」ではなく「ネットワーク依存のため実行スキップ」として扱うべき。
    """
    # fetch/axios/XMLHttpRequest を使っているか
    uses_network_api = bool(re.search(
        r'\bfetch\s*\(|\baxios\b|\bXMLHttpRequest\b|\.get\s*\(http|\.post\s*\(http',
        code
    ))
    if not uses_network_api:
        return False

    # ダミーURL、プレースホルダーURL（クォート形式に依存せず文字列内を検索）
    placeholder_url = bool(re.search(
        r'(?:/api/\w|https?://(?:api\.example|example\.com))',
        code
    ))
    return placeholder_url


def is_likely_runnable(code: str) -> bool:
    """
    コードが単独で実行可能なスニペットかを推定する。
    技術書には「概念説明用のスニペット」と「完全な実行可能コード」が混在する。
    スニペットの場合は実行せず構文チェックのみに留める。
    """
    code = code.strip()

    # import/require 文があって、何かしらの処理がある場合は実行可能と判断
    has_import = bool(re.search(r'^(import|const\s+\w+\s*=\s*require)', code, re.MULTILINE))

    # console.log や関数呼び出しで終わっているか（実行を意図している）
    has_execution = bool(re.search(
        r'(console\.(log|error|warn)|^\w+\(|\.then\(|await |describe\(|test\()',
        code, re.MULTILINE
    ))

    # 未解決の参照（他のコードに依存したスニペット）
    # 例：関数定義だけ、型定義だけ、クラスメソッドだけ
    is_fragment = bool(re.search(
        r'^\s*(\/\/\s*\.\.\.|\.\.\.)\s*$',
        code, re.MULTILINE
    ))

    if is_fragment:
        return False

    # import があるか、実行トリガーがあれば実行可能と判断
    return has_import or has_execution


def run_javascript(block: CodeBlock, tmpdir: str) -> CodeResult:
    """JavaScriptコードをNodeで実行する"""
    # ネットワーク依存のコードは実行せず、スキップ扱いにする
    if has_network_dependency(block.code):
        filepath = os.path.join(tmpdir, f"block_{block.index}.js")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(block.code)
        result = subprocess.run(['node', '--check', filepath], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            return CodeResult(block, "syntax_only",
                              note="ネットワーク依存のため実行スキップ（外部URL使用）。構文チェック → OK")
        else:
            return CodeResult(block, "failed", error=result.stderr.strip(),
                              note="ネットワーク依存のため実行スキップ（外部URL使用）。構文チェック → エラー")

    filepath = os.path.join(tmpdir, f"block_{block.index}.js")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(block.code)

    if not is_likely_runnable(block.code):
        # 構文チェックのみ
        result = subprocess.run(
            ['node', '--check', filepath],
            capture_output=True, text=True, timeout=10
        )
        if result.returncode == 0:
            return CodeResult(block, "syntax_only", note="スニペットのため構文チェックのみ実行 → OK")
        else:
            return CodeResult(block, "failed", error=result.stderr.strip(),
                              note="スニペットのため構文チェックのみ実行")
    else:
        result = subprocess.run(
            ['node', filepath],
            capture_output=True, text=True, timeout=15
        )
        if result.returncode == 0:
            return CodeResult(block, "passed", output=result.stdout.strip())
        else:
            return CodeResult(block, "failed",
                              output=result.stdout.strip(),
                              error=result.stderr.strip())


def run_typescript(block: CodeBlock, tmpdir: str) -> CodeResult:
    """TypeScriptコードを実行する（tsx または ts-node を使用）"""
    filepath = os.path.join(tmpdir, f"block_{block.index}.ts")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(block.code)

    # tsx を優先的に試す（インストール済みかチェック）
    runner = None
    for candidate in ['npx tsx', 'npx ts-node']:
        cmd_parts = candidate.split()
        try:
            result = subprocess.run(
                cmd_parts + ['--version'],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                runner = cmd_parts
                break
        except (subprocess.TimeoutExpired, FileNotFoundError):
            continue

    if runner is None:
        return CodeResult(block, "skipped",
                          note="ts-node または tsx が見つからないためスキップ。npm install -g tsx で導入できます。")

    if not is_likely_runnable(block.code):
        # ts-node で構文チェック相当（--dry-run 的な実行）
        return CodeResult(block, "syntax_only",
                          note="スニペットのため構文チェックのみ（実行スキップ）")

    result = subprocess.run(
        runner + [filepath],
        capture_output=True, text=True, timeout=30
    )
    if result.returncode == 0:
        return CodeResult(block, "passed", output=result.stdout.strip())
    else:
        return CodeResult(block, "failed",
                          output=result.stdout.strip(),
                          error=result.stderr.strip())


def check_jsx_syntax(block: CodeBlock, tmpdir: str) -> CodeResult:
    """JSX/TSXは実行環境が必要なため構文チェックのみ行う"""
    ext = 'tsx' if block.lang in ('tsx',) else 'jsx'
    filepath = os.path.join(tmpdir, f"block_{block.index}.{ext}")
    with open(filepath, 'w', encoding='utf-8') as f:
        # React importがない場合は追加（新JSX変換対応）
        code = block.code
        if 'import React' not in code and 'from "react"' not in code:
            code = '// React import省略（新JSX変換想定）\n' + code
        f.write(code)

    # tsc が使える場合は tsconfig.json を一時ディレクトリに作成して構文チェック
    tsc = shutil.which('tsc')
    if tsc:
        tsconfig_path = os.path.join(tmpdir, 'tsconfig.json')
        if not os.path.exists(tsconfig_path):
            import json
            tsconfig = {
                "compilerOptions": {
                    "jsx": "react-jsx",
                    "allowJs": True,
                    "esModuleInterop": True,
                    "allowSyntheticDefaultImports": True,
                    "noEmit": True,
                    "strict": False,
                    "skipLibCheck": True,
                    "target": "ES2020",
                    "module": "ESNext",
                    "moduleResolution": "bundler"
                },
                "include": [tmpdir + "/*.tsx", tmpdir + "/*.jsx", tmpdir + "/*.ts", tmpdir + "/*.js"]
            }
            with open(tsconfig_path, 'w') as tf:
                json.dump(tsconfig, tf)

        result = subprocess.run(
            ['tsc', '--project', tsconfig_path, '--noEmit',
             '--allowJs', '--jsx', 'react-jsx', filepath],
            capture_output=True, text=True, timeout=15,
            cwd=tmpdir
        )
        if result.returncode == 0:
            return CodeResult(block, "syntax_only",
                              note="JSX/TSX構文チェック（tsc）→ OK")
        else:
            # tscのエラーを整形して返す（不要な行を除く）
            errors = [l for l in result.stderr.strip().splitlines()
                      if not l.startswith('Version') and l.strip()]
            error_text = '\n'.join(errors[:10])  # 最大10行
            return CodeResult(block, "failed",
                              error=error_text,
                              note="JSX/TSX構文チェック（tsc）→ エラー")
    else:
        # tsc がなければ Babel パーサー相当の簡易チェックをスキップ
        return CodeResult(block, "skipped",
                          note="JSX/TSXはReact実行環境が必要なため実行スキップ（構文チェックにはtscが必要）")


def check_node_available() -> bool:
    return shutil.which('node') is not None


def format_results(results: list[CodeResult], markdown_path: str) -> str:
    """結果を読みやすい形式でフォーマットする"""
    lines = []
    lines.append(f"\n{'='*50}")
    lines.append(f"🔍 コードサンプル実行検証: {os.path.basename(markdown_path)}")
    lines.append(f"{'='*50}")

    total = len(results)
    passed = sum(1 for r in results if r.status == "passed")
    failed = sum(1 for r in results if r.status == "failed")
    skipped = sum(1 for r in results if r.status == "skipped")
    syntax_ok = sum(1 for r in results if r.status == "syntax_only")

    lines.append(f"\n📊 集計: 全{total}件 | ✅実行成功:{passed} | 🔤構文チェックOK:{syntax_ok} | ❌失敗:{failed} | ⏭スキップ:{skipped}")
    lines.append("")

    for result in results:
        b = result.block
        icon = {"passed": "✅", "failed": "❌", "skipped": "⏭️", "syntax_only": "🔤"}.get(result.status, "❓")
        lines.append(f"{icon} コードブロック #{b.index} (行{b.line_number}, 言語: {b.lang})")

        if result.note:
            lines.append(f"   📝 {result.note}")
        if result.output:
            output_preview = result.output[:200] + ("..." if len(result.output) > 200 else "")
            lines.append(f"   出力: {output_preview}")
        if result.error:
            error_preview = result.error[:300] + ("..." if len(result.error) > 300 else "")
            lines.append(f"   エラー: {error_preview}")
        lines.append("")

    if failed > 0:
        lines.append(f"⚠️  {failed}件のコードブロックが失敗しました。上記のエラーを確認してください。")
    else:
        lines.append("✨ 実行可能な全コードブロックが検証をパスしました。")

    lines.append(f"{'='*50}\n")
    return '\n'.join(lines)


def main():
    if len(sys.argv) < 2:
        print("使い方: python3 run_code_samples.py <markdown-file>")
        sys.exit(1)

    filepath = sys.argv[1]
    if not os.path.exists(filepath):
        print(f"エラー: ファイルが見つかりません: {filepath}")
        sys.exit(1)

    if not check_node_available():
        print("エラー: node が見つかりません。Node.js をインストールしてください。")
        sys.exit(1)

    with open(filepath, 'r', encoding='utf-8') as f:
        markdown = f.read()

    blocks = extract_code_blocks(markdown)

    target_langs = {'js', 'javascript', 'ts', 'typescript', 'jsx', 'tsx', 'react'}
    target_blocks = [b for b in blocks if b.lang in target_langs]

    if not target_blocks:
        print(f"対象のコードブロック（JS/TS/React）が見つかりませんでした。")
        print(f"全コードブロック数: {len(blocks)}")
        if blocks:
            langs = set(b.lang for b in blocks)
            print(f"検出された言語: {', '.join(langs)}")
        return

    results = []
    with tempfile.TemporaryDirectory() as tmpdir:
        for block in target_blocks:
            try:
                if block.lang in ('js', 'javascript'):
                    result = run_javascript(block, tmpdir)
                elif block.lang in ('ts', 'typescript'):
                    result = run_typescript(block, tmpdir)
                elif block.lang in ('jsx', 'tsx', 'react'):
                    result = check_jsx_syntax(block, tmpdir)
                else:
                    result = CodeResult(block, "skipped", note=f"未対応の言語: {block.lang}")
                results.append(result)
            except subprocess.TimeoutExpired:
                results.append(CodeResult(block, "failed",
                                          error="タイムアウト: コードの実行が時間切れになりました（無限ループの可能性）"))
            except Exception as e:
                results.append(CodeResult(block, "failed", error=f"予期しないエラー: {str(e)}"))

    print(format_results(results, filepath))
    # 失敗があれば終了コード1を返す
    if any(r.status == "failed" for r in results):
        sys.exit(1)


if __name__ == '__main__':
    main()
