---
id: NPizm80ZYQjqzDPef-Nhn
title: "Claude Skills でエージェントに専門的なタスクを実行させる"
slug: "claude-skills-custom-skills-for-claude"
about: "Claude Skills は Claude が特定のタスクを実行するためのカスタムスキルを作成・共有できる新しい機能です。この記事では、Claude Skills の仕組みと作成方法、MCP ツールとの違いについて解説します。"
createdAt: "2025-10-26T10:23+09:00"
updatedAt: "2025-10-26T10:23+09:00"
tags: ["claude"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/647wqryHihaEIfmM2ID2eC/4545a05bbb10dabf69c4374b9cb2d4f4/goma-toufu_22787-768x591.png"
  title: "ごま豆腐のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude Skills において、スキルの詳細な説明が段階的に読み込まれる設計の主な目的は何ですか？"
      answers:
        - text: "コンテキストウィンドウの圧迫を防ぎ、Claude の性能低下を防ぐため"
          correct: true
          explanation: "name と description フィールドがまず読み込まれ、必要な場合のみ SKILL.md の本文が読み込まれます。これにより、使用頻度の低いスキルの詳細説明がコンテキストを圧迫することを防いでいます。"
        - text: "スキルのディレクトリの構造をモジュール化するため"
          correct: false
          explanation: null
        - text: "セキュリティリスクを軽減するため"
          correct: false
          explanation: null
        - text: "複数のスキルを同時に実行できるようにするため"
          correct: false
          explanation: null
    - question: "SKILL.md ファイルの YAML フロントマターで必須のフィールドはどれですか？"
      answers:
        - text: "name と description"
          correct: true
          explanation: "name（最大64文字）と description（最大1024文字）の2つが必須フィールドです。Claude がスキルをどのタイミングで使用するかを判断するために利用されます。"
        - text: "name、description、version"
          correct: false
          explanation: "version フィールドは必須ではありません。必須なのは name と description のみです。"
        - text: "name のみ"
          correct: false
          explanation: "description フィールドも必須です。スキルの機能と使用方法を説明するために重要です。"
        - text: "name、description、author"
          correct: false
          explanation: "author フィールドは必須ではありません。必須なのは name と description のみです。"
published: true
---
Claude ではスプレッドシートやスライドを作成するためにスキルと呼ばれる機能を利用します。例えば「以下のマークダウンを元にスライドを作成してください」という指示を与えると、pptx スキル・html2pptx.md ファイルを読み込みスライドの作成方法を確認したうえで、アーティファクトとして pptx ファイルを生成します。

![](https://images.ctfassets.net/in6v9lxmm5c8/14xQ6dSTj2jK8eDyrbgwg9/19f9fc7161069bc68cce0338aa5bb92b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-26_10.55.44.png)

このスキルではスライドの元になる HTML ファイルを作成し、PptxGenJS ライブラリを使用して pptx ファイルを生成する JavaScript コードをサンドボックス内で実行している様子が確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4QieWDEVgZ5tcTJKjoUBF1/d66809aa53c8236ab5ac335fcf6773c0/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-26_10.59.43.png)

2025/10/17 に新たに発表された Claude Skills では、独自のスキルを作成し共有できるようになります。Claude Skills ではプレゼンテーションの作成スキルで示したように、コードの実行環境インフラ [Code Execution Tool](https://docs.claude.com/en/docs/agents-and-tools/tool-use/code-execution-tool) を活用して、JavaScript や Python のコードを実行できます。スキルの指示は `SKILL.md` という Markdown ファイルで記述し、追加のスクリプトやリソースをパッケージングします。

```sh
pdf-skill/
├── SKILL.md (main instructions)
├── FORMS.md (form-filling guide)
├── REFERENCE.md (detailed API reference)
└── scripts/
    └── fill_form.py (utility script)
```

作成したスキルは Claude アプリ, Claude Code, API で利用可能です。この記事では Claude Skills を実際に作成し、どのようにスキルが使われるかを紹介します。

## スキルを作成する

それでは実際にスキルを作成してみましょう。ここでは Playwright を使用して、ユーザーが指定した Web ページのスクリーンショットを PDF ファイルとして保存するスキルを作成してみましょう。

すべてのスキルはスキルの中核となる `SKILL.md` ファイルを含むディレクトリで構成されます。`SKILL.md` ファイルは YAML フロントマターと Markdown 本文で構成されます。YAML フロントマターでは以下のメタデータを指定します。

- `name`: スキルの名前。最大 64 文字（必須）
- `description`: スキルの機能と使用方法の説明。最大 1024 文字（必須）

上記のメタデータの中でも、スキルの機能と使用方法を説明する `description` フィールドは特に重要です。この `name` と `description` フィールドは Claude エージェントが起動したときに自動でシステムプロンプトに読み込まれ、Claude がスキルをどのタイミングで使用するかを判断するために利用されます。そして Claude がタスクを実行するためにスキルを使用するべきだと判断した場合、`SKILL.md` ファイルの本文部分が読み込まれコンテキストに追加されるのです。

このように段階的にスキルの情報を Claude に提供するアーキテクチャは、スキルの柔軟性と拡張性を高めるために重要な設計原則となっています。スキルとよく似た概念に MCP ツールがありますが、MCP ツールではツールの説明全体とツールのパラメーターをすべて一度に Claude に提供します。登録している MCP ツールが少ないうちは問題ありませんが、ツールの数が増えると使用頻度の低いツールの説明までコンテキストに含まれてしまい、コンテキストウィンドウが圧迫された結果、Claude の性能が低下するという問題が指摘されていました。MCP ツール使用時のコンテキスト最適化については以下の記事で詳しく解説されています。

https://zenn.dev/medley/articles/optimizing-claude-code-context-with-mcp-tool-audit

必要な場合のみスキルの詳細な説明を読み込むという設計は、まさにこの問題を解決するためのアプローチと言えます。コンテキストウィンドウの圧迫を防ぐために、`name` と `description` フィールドでは文字数制限を設けているという徹底ぶりです。

`screenshoting-webpages-to-pdf` ディレクトリを作成し、その中に `SKILL.md` ファイルを作成してみましょう。スキルの説明はできる限り具体的に、かつ簡潔に記述することが推奨されています。例えば Claude は知識として PDF の情報は知っているため、PDF とは何かを説明する必要はありません。以下のようにスキルの目的と使用方法を具体的に説明することが重要です。

スキルの名前は一貫性を保つため、スキルが提供する機能を動名詞（-ing 形）で表現することが推奨されています（`processing-pdfs`, `analyzing-spreadsheets`, `testing-code` など）。ここでは `screenshoting-webpages-to-pdf` という名前にしました。

スキルの本文においても段階的に情報を提供する設計が推奨されています。`SKILL.md` ファイルの本文は 500 行以下に抑えることが推奨されています。より詳細な情報を提供したい場合は別のファイルに分割し、本文中で相対パスを指定して参照します。以下が `screenshoting-webpages-to-pdf/SKILL.md` ファイルの例です。

````markdown:screenshoting-webpages-to-pdf/SKILL.md
---
name: "screenshoting-webpages-to-pdf"
description: "指定されたウェブページのスクリーンショットを取得し、PDF ファイルとして保存します。ユーザーがウェブページの全体像を把握したい場合に便利です。"
---

ウェブページのスクリーンショットを取得するために Playwright ライブラリを使用します。以下の手順でスクリーンショットを取得し、PDF ファイルとして保存します。

1. パッケージのインストール

```bash
npm install playwright pdf-lib
```

2. ウェブページのスクリーンショットを取得し、Artifact として保存する

Playwright を使用した JavaScript コード例は `./examples/take-screenshot.js` ファイルを参照してください。


3. スクリーンショットを PDF に変換する

PDF への変換には `pdf-lib` ライブラリを使用します。ヘルパースクリプトとして `./scripts/convert-to-pdf.js` ファイルを使用できます。

````

本文中で参照している `./examples/take-screenshot.js` と `./scripts/convert-to-pdf.js` ファイルも作成しましょう。

<details>
<summary>screenshoting-webpages-to-pdf/examples/take-screenshot.js</summary>

```javascript:screenshoting-webpages-to-pdf/examples/take-screenshot.js
#!/usr/bin/env node

/**
 * Playwright を使用してウェブページのスクリーンショットを取得するスクリプト
 *
 * 使用方法:
 *   node examples/take-screenshot.js <URL1> [URL2] [URL3] ...
 *
 * 例:
 *   node examples/take-screenshot.js https://example.com
 *   node examples/take-screenshot.js https://example.com https://github.com
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

// スクリーンショット保存先ディレクトリ
const SCREENSHOTS_DIR = path.join(process.cwd(), "screenshots");

/**
 * 指定された URL のスクリーンショットを取得
 * @param {string} url - スクリーンショットを取得する URL
 * @param {number} index - ファイル名に使用するインデックス
 * @returns {Promise<string>} 保存されたファイルのパス
  */
async function takeScreenshot(url, index) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  try {
    console.log(`📸 ${url} にアクセス中...`);
    await page.goto(url, { waitUntil: "networkidle" });

    // URL からファイル名を生成（安全な文字列に変換）
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/\./g, "_");
    const timestamp = Date.now();
    const filename = `screenshot_${index + 1}_${hostname}_${timestamp}.png`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);

    // フルページスクリーンショットを取得
    await page.screenshot({
      path: filepath,
      fullPage: true,
    });

    console.log(`✅ スクリーンショット保存完了: ${filename}`);
    return filepath;
  } catch (error) {
    console.error(`❌ エラー (${url}):`, error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * メイン処理
 */
async function main() {
  const urls = process.argv.slice(2);

  if (urls.length === 0) {
    console.error("❌ エラー: URL を指定してください");
    console.log("\n使用方法:");
    console.log(
      "  node examples/take-screenshot.js <URL1> [URL2] [URL3] ...\n",
    );
    console.log("例:");
    console.log("  node examples/take-screenshot.js https://example.com");
    console.log(
      "  node examples/take-screenshot.js https://example.com https://github.com",
    );
    process.exit(1);
  }

  // スクリーンショット保存ディレクトリを作成
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    console.log(`📁 ディレクトリ作成: ${SCREENSHOTS_DIR}\n`);
  }

  console.log(`🚀 ${urls.length} 件の URL のスクリーンショットを取得します\n`);

  const savedFiles = [];
  let successCount = 0;
  let failCount = 0;

  // 各 URL を順番に処理
  for (let i = 0; i < urls.length; i++) {
    try {
      const filepath = await takeScreenshot(urls[i], i);
      savedFiles.push(filepath);
      successCount++;
    } catch (error) {
      failCount++;
    }
    console.log(""); // 空行で区切る
  }

  // 結果サマリー
  console.log("=".repeat(60));
  console.log(`✅ 成功: ${successCount} 件`);
  console.log(`❌ 失敗: ${failCount} 件`);
  console.log("=".repeat(60));

  if (savedFiles.length > 0) {
    console.log("\n📄 保存されたファイル:");
    savedFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${path.basename(file)}`);
    });

    console.log("\n💡 PDF に変換するには:");
    console.log(`  node scripts/convert-to-pdf.js ${savedFiles.join(" ")}`);
  }
}

// スクリプト実行
main().catch((error) => {
  console.error("予期しないエラーが発生しました:", error);
  process.exit(1);
});
```

</details>

<details>
<summary>screenshoting-webpages-to-pdf/scripts/convert-to-pdf.js</summary>

```javascript:screenshoting-webpages-to-pdf/scripts/convert-to-pdf.js
#!/usr/bin/env node

/**
 * PNG 画像を PDF ファイルに変換するスクリプト
 *
 * 使用方法:
 *   node scripts/convert-to-pdf.js <画像ファイル1> [画像ファイル2] ... [出力ファイル名]
 *
 * 例:
 *   node scripts/convert-to-pdf.js screenshots/image1.png screenshots/image2.png
 *   node scripts/convert-to-pdf.js screenshots/image1.png screenshots/image2.png output.pdf
 */

const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

/**
 * PNG 画像を PDF に変換
 * @param {string[]} imagePaths - 変換する画像ファイルのパス配列
 * @param {string} outputPath - 出力する PDF ファイルのパス
 */
async function convertToPdf(imagePaths, outputPath) {
  console.log("📝 PDF ドキュメントを作成中...\n");

  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];

    try {
      console.log(
        `📄 ${i + 1}/${imagePaths.length}: ${path.basename(imagePath)} を追加中...`,
      );

      // 画像ファイルを読み込み
      const imageBytes = fs.readFileSync(imagePath);

      // PNG 画像を PDF に埋め込み
      const image = await pdfDoc.embedPng(imageBytes);
      const { width, height } = image.scale(1);

      // 画像のサイズに合わせたページを追加
      const page = pdfDoc.addPage([width, height]);

      // ページに画像を描画
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });

      console.log(`  ✅ サイズ: ${width}x${height} px`);
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}`);
      throw error;
    }
  }

  // PDF を保存
  console.log(`\n💾 PDF を保存中: ${outputPath}...`);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  // ファイルサイズを取得
  const stats = fs.statSync(outputPath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`✅ PDF 作成完了!`);
  console.log(`  📊 ページ数: ${imagePaths.length}`);
  console.log(`  📦 ファイルサイズ: ${fileSizeInMB} MB`);
  console.log(`  📁 保存先: ${outputPath}`);
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("❌ エラー: 画像ファイルを指定してください");
    console.log("\n使用方法:");
    console.log(
      "  node scripts/convert-to-pdf.js <画像ファイル1> [画像ファイル2] ... [出力ファイル名]\n",
    );
    console.log("例:");
    console.log(
      "  node scripts/convert-to-pdf.js screenshots/image1.png screenshots/image2.png",
    );
    console.log(
      "  node scripts/convert-to-pdf.js screenshots/image1.png screenshots/image2.png output.pdf",
    );
    process.exit(1);
  }

  // 最後の引数が .pdf で終わる場合は出力ファイル名として扱う
  let outputPath = "output.pdf";
  let imagePaths = args;

  if (args[args.length - 1].endsWith(".pdf")) {
    outputPath = args[args.length - 1];
    imagePaths = args.slice(0, -1);
  }

  // 画像ファイルの存在確認
  const missingFiles = imagePaths.filter((file) => !fs.existsSync(file));
  if (missingFiles.length > 0) {
    console.error("❌ エラー: 以下のファイルが見つかりません:");
    missingFiles.forEach((file) => console.error(`  - ${file}`));
    process.exit(1);
  }

  // PNG ファイル以外が含まれていないか確認
  const nonPngFiles = imagePaths.filter(
    (file) => !file.toLowerCase().endsWith(".png"),
  );
  if (nonPngFiles.length > 0) {
    console.warn("⚠️  警告: PNG 以外のファイルが含まれています:");
    nonPngFiles.forEach((file) => console.warn(`  - ${file}`));
    console.log(
      "\n続行しますか? このスクリプトは PNG ファイルのみをサポートしています。",
    );
    console.log("他の形式の場合、エラーが発生する可能性があります。\n");
  }

  try {
    await convertToPdf(imagePaths, outputPath);
  } catch (error) {
    console.error("\n❌ PDF 作成中にエラーが発生しました:", error.message);
    process.exit(1);
  }
}

// スクリプト実行
main().catch((error) => {
  console.error("予期しないエラーが発生しました:", error);
  process.exit(1);
});
```

</details>

:::warning
ここではスキルを検証する目的で「バイブコーディング」でコードを作成しましたが、コードの実行権限を与えるという性質上、セキュリティリスクが伴います。実際にスキルを作成する際は、信頼できるコードのみを使用し、必要最低限の権限で実行するように注意してください。
:::

最終的なディレクトリ構成は以下のようになります。

```sh
screenshoting-webpages-to-pdf/
├── SKILL.md
├── examples/
│   └── take-screenshot.js
└── scripts/
    └── convert-to-pdf.js
```

最後に作成したスキルを Claude アプリや Claude Code で利用できるようにするために、スキルのディレクトリを ZIP アーカイブに圧縮します。

```bash
cd screenshoting-webpages-to-pdf
zip -r screenshoting-webpages-to-pdf.zip .
```

これでスキルの作成は完了です。次に作成したスキルを実際に利用してみましょう。

## Claude アプリからスキルを利用する

Claude アプリでスキルを利用する場合は Pro, Max, Team, Enterprise プランのいずれかに加入している必要があります。Claude アプリの[設定](https://claude.ai/settings/capabilities)画面を開き、「Skills」セクションで「Upload Skill」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/4N6U1ozPTZpzLsbc3e92pz/e5099f5e58cb474d98753ccade0bb175/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-26_13.03.02.png)

ファイルを選択するダイアログが表示されるので、先ほど作成した `screenshoting-webpages-to-pdf.zip` ファイルを選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6uyAKcmLFHJZzZq9QTSMoj/4d42ae2f6f3a8b27df330e9f8ccdd1d6/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-26_13.05.20.png)

Skills の一覧にアップロードしたスキルが追加されていることが確認できます。トグルスイッチがオンになっている場合はスキルが有効化されている状態です。

![](https://images.ctfassets.net/in6v9lxmm5c8/7fbBpyZ6kEmkD0lABHf55E/31f26056da8d14acea03a34582d7c978/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-26_13.07.00.png)

チャット画面でスキルを利用してもらえるか確認してみましょう。以下のプロンプトを入力します。

```txt
顧客に成果物を納品するために azukiazusa.dev のいくつかのページをスクリーンショットとして取得し、PDF ファイルにまとめてください。
```

スキルの使用方法を確認し、さらにスクリプトの example や scripts を追加で読み込んでいることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/29nQ6SlnRa0pONxPWmLcJf/b3c4a9060600a1b76552d5c7303bb2f5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-26_13.10.23.png)

`playwright` パッケージをインストールしようとしたタイミングで `npm error config prefix cannot be changed from project config: ` というエラーが発生して失敗しているため、このあたりは改善する必要がありそうです。例えば公式のサンプルである [artifacts-builder](https://github.com/anthropics/skills/tree/main/artifacts-builder) の例では、[`scripts/init-artifact.sh`](https://github.com/anthropics/skills/blob/main/artifacts-builder/scripts/init-artifact.sh) スクリプトを使用してプロジェクトをセットアップするように指示されています。

最終的に代替手段を使用して PDF ファイルを生成し、アーティファクトとして提供されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/2ZYsexdvN5FW2nIdqNh5Ez/9e80db5c35f1d214849248bfa30b0a90/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-26_13.21.15.png)

## まとめ

- Claude Skills は特定のタスクを実行するためのカスタムスキルを作成し、Claude アプリや Claude Code で利用できる機能
- スキルでは Code Execution Tool を活用して、JavaScript や Python のコードを実行できるため、通常の Claude よりも高度なタスクを実行可能
- スキルは `SKILL.md` ファイルを中心に構成され、スキルの名前や説明、使用方法を段階的に提供する設計が推奨されている。この設計はコンテキストウィンドウの圧迫を防ぎ、Claude の性能低下を防ぐために重要
- `SKILL.md` ファイルの本文は 500 行以下に抑え、詳細な情報は別のファイルに分割して参照することが推奨されている
- 作成したスキルは ZIP アーカイブに圧縮し、Claude アプリの設定画面からアップロードして利用可能

## 参考

- [Claude Skills: Customize AI for your workflows \ Anthropic](https://www.anthropic.com/news/skills)
- [Equipping agents for the real world with Agent Skills \ Anthropic](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Agent Skills - Claude Docs](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [Skill authoring best practices - Claude Docs](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- [anthropics/skills](https://github.com/anthropics/skills)
- [How to create custom Skills | Claude Help Center](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Claude Skillsとは何なのか？](https://blog.lai.so/claude-skills/)
