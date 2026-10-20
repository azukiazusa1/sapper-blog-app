---
id: pN7zw61MhVzDfXhGZVBDT
title: "Claude Code の Mods で Claude Code 自身に機能を追加する"
slug: "claude-code-mods"
about: "Claude Code の Mods は、Claude Code のプロセス内で動く TypeScript/JavaScript の関数でイベントを観察・書き換え・代わりに応答できる仕組みです。settings hooks では難しかった UI の描画や組み込み機能の置き換えもできます。この記事では、危険な Bash コマンドを止めてプロンプトの上に件数を表示する mod を作りながら、Mods の仕組みと設計の背景、セキュリティ上の注意点を紹介します。"
createdAt: "2026-10-20T12:47+09:00"
updatedAt: "2026-10-20T12:47+09:00"
tags: ["claude-code"]
thumbnail: 
  url: "https://images.ctfassets.net/in6v9lxmm5c8/27SOtIZC7ydElKzlS0X9It/66ea17e17ec7e55433dd96d7ea80a341/tarako_19133-768x591.png"
  title: "たらこのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude Code で、あるプラグインが mod として扱われるための条件はどれですか？"
      answers:
        - text: "plugin.json に type: mod を指定する"
          correct: false
          explanation: "マニフェストに特別なフィールドは必要ありません。mod かどうかは hooks.json の内容で決まります。"
        - text: "settings.json の hooks に関数のパスを登録する"
          correct: false
          explanation: "settings.json の hooks は settings hook の設定です。mod はプラグインの中に hooks module を含めることで作ります。"
        - text: "hooks/hooks.json の modules キーで hooks module のパスを指定する"
          correct: true
          explanation: "記事で説明したとおり、hooks.json の modules キーで JavaScript/TypeScript のファイルを指定すると、そのプラグインが mod になります。"
        - text: "Node.js とバンドラーで hooks module をビルドしておく"
          correct: false
          explanation: "Claude Code は .ts や .tsx などのファイルを直接読み込むため、Node.js やバンドラー、ビルドステップは不要です。"
    - question: "claude plugin validate が mod を実行せずに、mod が呼び出す API を一覧できる理由として正しいものはどれですか？"
      answers:
        - text: "mod の外側への作用がすべて $ を経由し、静的解析で読み取れるから"
          correct: true
          explanation: "ファイル操作やプロセス起動などへの暗黙のアクセスをなくし、すべてを $ 経由にする設計のため、ソースコードの静的解析で calls を一覧できます。"
        - text: "validate が mod を一時的なサンドボックスで実行して呼び出しを記録するから"
          correct: false
          explanation: "validate は mod のコードを実行しません。ソースコードを静的に解析しています。"
        - text: "mod が plugin.json に呼び出す API をすべて宣言しているから"
          correct: false
          explanation: "API の一覧はマニフェストではなく、ソースの静的解析から得られます"
        - text: "hooks module が Node.js の fs モジュールの呼び出しを記録するから"
          correct: false
          explanation: "hooks module は Node.js の API を持たない環境で実行されるため、node:fs をインポートできません。"
    - question: "ガード用の tool.call の hook が next を呼ぶ前に例外を投げた場合、.catch を登録していなければどうなりますか？"
      answers:
        - text: "セッション全体がエラーで終了する"
          correct: false
          explanation: "セッションを壊さないことを優先し、失敗した hook はスキップされます。"
        - text: "そのツール呼び出しは必ず拒否される"
          correct: false
          explanation: "自動で拒否されるわけではありません。拒否させたい場合は .catch で明示的に deny を返す必要があります。"
        - text: "同じ hook が成功するまで再実行される"
          correct: false
          explanation: "失敗した hook が自動で再実行されることはありません。"
        - text: "その hook はスキップされ、次のハンドラーが実行される"
          correct: true
          explanation: "next を呼ぶ前に失敗した hook はスキップされ、次のハンドラーが代わりに実行されます。そのためガード用の hook は、.catch で失敗時にもコマンドを止めるようにします。"
published: true
---

Claude Code をカスタマイズする方法として、これまでも [hooks](https://code.claude.com/docs/en/hooks)、Skill、MCP サーバー、ステータスラインなどが提供されてきました。しかし、これらはいずれも Claude Code の外側で動く仕組みです。たとえば hooks はイベントごとにシェルコマンドを実行し、その終了コードや JSON 出力でツール呼び出しを止めることはできますが、Claude Code の画面を描き替えたり、組み込みの処理を置き換えたりすることはできませんでした。

2026 年 10 月 1 日、Claude Code に [Mods](https://code.claude.com/docs/en/plugins/mods/overview) が正式に追加されました。mod は Claude Code のプロセスの中で動く TypeScript/JavaScript の関数で、ツール呼び出しやプロンプトの送信、画面の描画といったイベントを観察・書き換え・代わりに応答できます。Claude Code 自身の `/diff` もすでに mod として実装されています。

この記事では、危険な Bash コマンドを止めてその件数をプロンプトの上に表示する mod を作りながら、Mods の仕組み、現在の API の形になった設計の背景、セキュリティ上の注意点を紹介します。

## Mods とは

公式ドキュメントでは、mod は「Claude Code の見た目と振る舞いを変える[プラグイン](https://code.claude.com/docs/en/plugins/overview)」と説明されています。プラグインの中に JavaScript/TypeScript のコードを含めると、そのプラグインが mod になります。そのため、インストールや配布にはこれまでと同じ `/plugin install` やマーケットプレイスの仕組みを使います。

mod のコードは、イベントごとに呼び出される関数を登録します。この関数を公式ドキュメントでは hook と呼び、従来の settings ファイルに書く hooks を「settings hook」と呼んで区別しています。この記事でも同じ呼び方をします。

mod でできることの例として、公式ドキュメントでは次のものが挙げられています。

- トランスクリプトの横のペインや、プロンプトの上の帯状の領域に、ボタンやテキスト入力を含む独自の UI を描画する
- ツール呼び出しの行やスピナーなど、Claude Code 自身が描画している UI を書き換える
- ツール呼び出しを保留してユーザーに質問したり、ツールを実行せずに代わりに結果を返したりする
- Claude のターンを介さずに、即座に関数を実行する `/command` を追加する

## mod の構成

mod は最小で 3 つのファイルからなります。

```text
danger-guard/
├── .claude-plugin/
│   └── plugin.json
└── hooks/
    ├── hooks.json
    └── register.tsx
```

- `plugin.json`: プラグインのマニフェスト
- `hooks.json`: `modules` キーで hooks module のパスを指定する。このキーがあることでプラグインが mod になる
- `register.tsx`: hooks module 本体

Claude Code は `.ts`・`.tsx`・`.js` などのファイルを直接読み込むため、Node.js やバンドラー、ビルドステップは不要です。

`hooks.json` は次のように hooks module のパスを 1 つだけ指定します。

```json:hooks/hooks.json
{
  "modules": ["./register.tsx"]
}
```

hooks module は `register` 関数をエクスポートします。Claude Code は mod を読み込むときに `register` を一度だけ呼び出し、引数として `on` 関数を渡します。`on(イベント名, マッチャー, hook)` を呼び出すことで、イベントに hook を登録します。

```ts
import type { Register } from "claude-code";

export const register: Register = (on) => {
  on("tool.call", { tool: "Bash" }, async ($, e, next) => {
    // ...
    return next(e);
  });
};
```

## `$`・`e`・`next` でイベントを扱う

すべての hook は `($, e, next)` という 3 つの引数を受け取ります。

- `$`: mods API。描画、コマンドの登録、モデル呼び出し、ファイルやプロセスへのアクセスなど、mod の外側に作用する操作はすべて `$.ui.toast()` や `$.process.run()` のように `$` を経由する
- `e`: イベントの入力。`tool.call` なら `e.tool` にツール名、`e.command` に Bash のコマンドが入る
- `next`: 次のハンドラーを呼び出す関数。チェーンの最後では Claude Code 自身の処理が実行され、その結果が返る

`next` をどう扱うかによって、hook の振る舞いは次の 3 つに分かれます。

```ts
// ログを出すだけで、次のハンドラーにそのまま渡す
on("tool.call", async ($, e, next) => {
  $.ui.log("Claude is about to use " + e.tool);
  return next(e);
});

// イベントのコピーを変更して次へ渡す
on("prompt.submit", async ($, e, next) => {
  return next({ ...e, text: e.text.trim() });
});

// next を呼ばずに結果を返す（後続の mod と Claude Code の処理は実行されない）
on("tool.call", { tool: "Bash" }, async () => {
  return { deny: "Bash is turned off in this project. Use the file tools." };
});
```

`await next(e)` の後に処理を書けば、ツールの実行後に結果を見て処理を追加できます。Express や Koa のミドルウェアを使ったことがある方なら馴染みのある形でしょう。

### 複数の mod はオニオンモデルで重なる

同じイベントに複数の mod が hook を登録している場合、それらは 1 つのミドルウェアチェーンを形成します。玉ねぎの皮のように hook が重なり、イベントは外側から内側へ進み、結果は内側から外側へ戻ってきます。この構造はオニオンモデルと呼ばれ、Node.js の Web フレームワーク Koa のミドルウェアで知られています。

具体的な例で確認しましょう。すべての Bash コマンドを記録する mod A と、`rm -rf` を拒否する mod B が、どちらも `tool.call` に hook を登録しているとします。A が先に読み込まれているとき、A が外側、B が内側になります。

```ts
// mod A（外側）: すべてのコマンドを記録する
on("tool.call", { tool: "Bash" }, async ($, e, next) => {
  $.ui.log("A: 前");
  const result = await next(e); // 内側の B へ進む
  $.ui.log(`A: 後 (deny=${result.deny !== undefined})`);
  return result;
});
```

```ts
// mod B（内側）: rm -rf を拒否する
on("tool.call", { tool: "Bash" }, async ($, e, next) => {
  $.ui.log("B: 前");
  if (/\brm\s+-rf\b/.test(e.command)) {
    $.ui.log("B: 拒否");
    return { deny: "rm -rf は実行できません" };
  }
  const result = await next(e); // Claude Code がツールを実行する
  $.ui.log("B: 後");
  return result;
});
```

`await next(e)` は「1 つ内側へ進み、内側の処理がすべて終わって結果が返るまで待つ」という意味です。Claude が `ls` を実行するとき、ログは次の順に出力されます。

```text
A: 前 → B: 前 → （ls を実行） → B: 後 → A: 後 (deny=false)
```

一方、`rm -rf build` を実行しようとすると、B は `next` を呼ばずに `{ deny }` を返すため、ツールは実行されません。それでも B の結果は A の `await next(e)` に戻ってくるので、A は拒否されたことを知ることができます。

```text
A: 前 → B: 前 → B: 拒否 → A: 後 (deny=true)
```

この例から、オニオンモデルの次の性質がわかります。

- 外側の hook はイベントを最初に受け取り、結果を最後に受け取る。内側で拒否された操作も含めて、すべてを観察できる
- 外側の hook が `next` を呼ばなければ、内側の hook は実行されない。逆に、内側の hook が外側の hook を止めることはできない

チェーンの順序は mod の出所で決まります。組み込みのガード mod や、組織の管理者が managed settings の `prependPlugins` で指定した mod は、ユーザーがインストールした mod より前に置かれます。

## 設計の背景

Mods は正式公開の前に GitHub の Issue [Mods - make Claude 10x more extensible (#91870)](https://github.com/anthropics/claude-code/issues/91870) で設計が公開され、コミュニティからのフィードバックを受けて形が固まりました。2026 年 9 月 3 日の最初の投稿の時点では「function hooks」と呼ばれており、9 月 9 日の更新で製品名が「Claude Mods」に決まりました。

最初の投稿では、この仕組みを Express や Koa にならった「登録順にもとづく `next` の継続モデル」と説明しています。Koa を参考にしたオニオンモデルを採用した理由について、Anthropic のエンジニアはコメントで、先に登録したプラグインが後続の hook を「所有」し、後ろのプラグインが上のプラグインを妨げられないことを挙げています。組織の管理者が自分の mod を先頭に置けば、拒否された操作も含めてすべてのイベントを監査できる、という狙いです。

`$` を経由させる設計にも理由があります。Issue のコメントでは、プラグインができることを制限するのが目的ではなく、ファイル操作やプロセス起動などへの暗黙のアクセスをなくし、すべてを `$` に通すことで管理者が監査・許可・拒否・記録できるようにするためだと説明されています。実際に hooks module は DOM も Node.js の API も持たない独立した環境で実行され、`import fs from "node:fs"` のような書き方はできません。この設計により、後述する `claude plugin validate` は mod を実行せずに、ソースコードの静的解析だけで mod が何を呼び出すかを一覧できます。

## 危険なコマンドを止める mod を作る

ここからは、`rm -rf` や `git push --force` のような危険な Bash コマンドを止めて、止めた件数をプロンプトの上に表示する `danger-guard` という mod を作ります。

まずはマニフェストを作成します。`name` が `claude-` で始まるなど Anthropic 公式のものに見える名前は、`claude plugin validate` で拒否される点に注意してください。

```json:.claude-plugin/plugin.json
{
  "name": "danger-guard",
  "version": "0.1.0",
  "description": "Blocks dangerous Bash commands and shows how many were blocked above the prompt",
  "author": {
    "name": "azukiazusa"
  }
}
```

`hooks/hooks.json` は前述のとおり `./register.tsx` を指定します。hooks module 本体は次のとおりです。

```tsx:hooks/register.tsx
import type { Register } from "claude-code";

// rm -rf と git push --force / -f を危険なコマンドとして扱う
const DANGEROUS =
  /\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r|\bgit\s+push\b.*(--force\b|\s-f\b)/;

let blocked = 0;

export const register: Register = (on) => {
  on("tool.call", { tool: "Bash" }, async ($, e, next) => {
    if (!DANGEROUS.test(e.command)) {
      return next(e);
    }
    blocked += 1;
    $.ui.invalidate("ui.render");
    return {
      deny: `${e.command} は danger-guard によりブロックされました。破壊的でない別の方法を提案してください。`,
    };
  }).catch(async ($, e, next) => {
    // ガード自体が失敗したときはコマンドを実行しない
    if (next.called) return next(e);
    return { deny: "danger-guard の判定に失敗したため、コマンドを実行しませんでした。" };
  });

  on("ui.render", { component: "AbovePrompt" }, async ($, e, next) => {
    if (blocked === 0 || e.props.hasSurvey) {
      return next(e);
    }
    const { Box, Text } = $.ui.resolve(e);
    return (
      <Box>
        <Text color="yellow">
          danger-guard: {blocked} 件の危険なコマンドをブロックしました
        </Text>
      </Box>
    );
  });
};
```

:::warning
この mod はコマンドの文字列を正規表現で判定しているだけなので、安全ではありません。あくまで mod の仕組みを紹介するための例です。
:::

1 つ目の hook は `tool.call` イベントに登録しています。第 2 引数の `{ tool: "Bash" }` はマッチャーで、Bash ツールの呼び出しのときだけ hook が実行されます。マッチャーには値のほか、配列や正規表現も指定できます。

コマンドが危険でなければ `next(e)` をそのまま返すので、通常どおりパーミッションチェックを経てコマンドが実行されます。危険なコマンドの場合は `next` を呼ばずに `{ deny: ... }` を返します。これでコマンドは実行されず、パーミッションの確認ダイアログも表示されません。Claude は `deny` の文字列をツールの結果として受け取るので、Claude が次の行動を決められるような指示として書くのがポイントです。

hook が `next` を呼ぶ前に例外を投げると、Claude Code はセッションを壊さないようにその hook をスキップし、内側のハンドラーと Claude Code 自身の処理を続けます。つまり、ガード用の hook がバグで失敗すると、危険なコマンドがそのまま実行されてしまいます。これを防ぐため、`on` が返す登録オブジェクトの `.catch` で失敗時のハンドラーを登録し、失敗したときもコマンドを止めるようにしています。

`next.called` は、失敗した hook がすでに `next` を呼んでいたかを表します。すでに `next` を呼んでいた場合はツールが実行済みか実行中なので、`next(e)` でその結果をそのまま返します。

2 つ目の hook は `ui.render` イベントに登録しています。`ui.render` は Claude Code が画面の各部分を描画するたびに発生するイベントで、`{ component: "AbovePrompt" }` を指定するとプロンプトの上の帯状の領域を描画するときだけ実行されます。描画に使う `Box` や `Text` は `$.ui.resolve(e)` で取得します。jsx を使用して描画することができます。

`tool.call` の hook の中で呼んでいる `$.ui.invalidate("ui.render")` は、Claude Code に再描画を依頼するメソッドです。`blocked` はモジュールレベルの変数なので、値が変わったことを Claude Code に伝えないと画面の更新が行われません。

## validate と test で確かめる

mod を読み込む前に、`claude plugin validate` で Claude Code が mod をどう解釈するかを確認できます。

```bash
claude plugin validate ./danger-guard
```

実行すると、次のような出力が得られました。

```text
Validating hooks: .../danger-guard/hooks/hooks.json

  ❯ ./register.tsx hooks: tool.call{tool=Bash}, ui.render{component=AbovePrompt}
  ❯ ./register.tsx gating hook with .catch: tool.call{tool=Bash}
  ❯ ./register.tsx calls: $.ui.invalidate, $.ui.resolve

✔ Validation passed
```

`hooks:` の行は mod が登録したイベントとマッチャー、`calls:` の行は mod が呼び出す mods API の一覧です。`gating hook with .catch` は、ツール呼び出しを拒否できる hook に `.catch` が付いていることを示しています。`.catch` を外すと、この行は `gating hook without .catch` に変わります。

`calls:` を一覧できるのは、前述のとおりすべての操作が `$` を経由するためです。この静的解析を成り立たせるため、hooks module の書き方にはいくつか制約があります。

- `const ui = $.ui` のように `$` やその名前空間を変数に代入したり、分割代入したりしない
- `on` に渡すイベント名は文字列リテラルにする
- 動的な `import()` や `require` を使わず、プラグイン内のファイルだけを相対パスで `import` する

他人が作った mod をインストールする前にも `claude plugin validate` を実行すれば、その mod がファイルの読み書きやプロセスの起動、ネットワークアクセスを行うかを、コードを実行せずに確認できます。

続いて自動テストを書きます。`claude plugin test` を使うと、セッションやログイン、ネットワークなしでイベントを発火させ、hook の振る舞いを確認できます。

```tsx:tests/danger-guard.test.tsx
import { expect, test } from "claude-code/testing";

test("危険なコマンドだけをブロックする", async ($, on) => {
  // Claude Code の代わりにツール呼び出しへ応答し、実際のコマンドは実行しない
  on("tool.call", () => ({ result: "ok" }));

  const safe = await $.tool.call({ tool: "Bash", command: "ls -la" });
  expect(safe.deny).toBeUndefined();

  const rm = await $.tool.call({ tool: "Bash", command: "rm -rf build" });
  expect(rm.deny).toContain("danger-guard");

  const push = await $.tool.call({
    tool: "Bash",
    command: "git push -f origin main",
  });
  expect(push.deny).toContain("danger-guard");

  for (const surface of ["terminal", "desktop"] as const) {
    const ui = await $.ui.mount({
      plugin: "danger-guard",
      surface,
      component: "AbovePrompt",
      props: { hasSurvey: false, isWorking: false, maxRows: 10 },
    });
    expect(await ui.find({ type: "Text", text: /2 件/ })).toBeDefined();
    await ui.unmount();
  }
});
```

テストの中で `on("tool.call", ...)` を使うと、Claude Code の代わりにツール呼び出しへ応答できます。これにより `$.tool.call()` でツール呼び出しを発火させ、返ってきた結果を検証します。`$.ui.mount` は指定した surface で render site を描画し、描画結果の要素を検索できるようにします。ターミナルと Desktop アプリの両方で件数が表示されることを確認しています。

mod のディレクトリで次のコマンドを実行します。

```bash
claude plugin test
```

```text
tests/danger-guard.test.tsx:
(pass) 危険なコマンドだけをブロックする [24.14ms]

 1 pass
 0 fail
Ran 1 test across 1 file. [0.19s]
```

テストが通りました。期待する件数を `/3 件/` に変えるとテストが失敗することも確認しており、描画結果を実際に検証できていることがわかります。

## 実際のセッションで mod を動かす

`--plugin-dir` フラグで mod のディレクトリを指定すると、mod を読み込めます。

```bash
claude --plugin-dir ./danger-guard
```

`--plugin-dir` で読み込んだディレクトリは監視されており、ファイルを保存すると mod がホットリロードされます。

実際に `build` ディレクトリがある場所で Claude Code v2.1.302 を起動し、「`rm -rf build` を実行してみて」と依頼してみました。Claude は Bash ツールで `rm -rf build` を呼び出しましたが、mod がコマンドを拒否したため `build` ディレクトリは削除されず、プロンプトの上には次のように表示されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/Ec3xuQsLOmHlKZub2cN60/bf5c080805a13463021958e80e7df677/claude-code-mods-1.png)

## Claude に mod を書かせる

ここまで mod を手で書いてきましたが、Claude Code のセッションで「プロンプトの上に現在の Git ブランチを表示する mod を作って」のように依頼すれば、Claude が mod を書いてくれます。Claude Code には mod を書くための `plugin-authoring` という Skill が組み込まれており、Claude はこの Skill に従って、そのセッションで使える API の型定義を参照しながら mod を作成します。

Claude が書いた mod は `~/.claude/dev-mods/<セッション ID>/` の下に保存されます。最初のファイルが保存されると「Enable hot reloading for this session?」という確認が表示され、「Enable for this session」を選ぶとターンの終了時に mod が読み込まれます。以降はターンの終わりに変更が反映されるので、Claude と対話しながら mod を調整できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6goBUZWiHx8LfWLWqKXEVm/275511465b0c61592a64f9ce5ce2b964/claude-code-mods-2.png)

Claude が書いた mod はそのセッションでしか読み込まれず、一定期間が過ぎると削除されます。使い続けたい場合はディレクトリを別の場所にコピーし、`--plugin-dir` で読み込むかマーケットプレイスで配布します。

## セキュリティと無効化

mod はサンドボックス化されておらず、ユーザーの権限で動作します。公式ドキュメントでは、読み込まれた mod が次のことをできると説明しています。

- ユーザーとしてファイルを読み書きし、プログラムを起動し、ネットワークにアクセスする
- 環境変数や設定ファイルに含まれる API キーなどの秘密情報を読む
- 送信したプロンプトや Claude のツール呼び出しをすべて見る
- プロンプトやツール呼び出しを書き換え、ユーザーに確認せずにツール呼び出しを承認する
- ユーザーのプランや API キーでモデルを呼び出す

[サンドボックス](https://code.claude.com/docs/en/sandboxing)を有効にしていても、サンドボックスで隔離されるのは Claude が実行する Bash コマンドであり、mod が起動するプロセスは対象外です。ただし、mod でもパーミッションの確認ダイアログの表示内容は変更できません。

mod は信頼できる作者やマーケットプレイスのものだけをインストールし、インストール前に `claude plugin validate` で何を呼び出すかを確認しましょう。

## まとめ

- Mods は Claude Code のプロセス内で動く TypeScript/JavaScript の関数で、ツール呼び出し・プロンプト・描画などのイベントを観察・書き換え・代わりに応答できる
- mod は `hooks/hooks.json` の `modules` で hooks module を指定したプラグインであり、既存のプラグインと同じ方法でインストール・配布する
- hook は `($, e, next)` を受け取り、`next` を呼ぶかどうかとその渡し方で振る舞いが決まる。複数の mod は Koa のようなオニオンモデルで重なり、先に置かれた mod が後続を監査・制御できる
- 外部への作用をすべて `$` 経由に限定しているため、`claude plugin validate` で mod を実行せずに登録したイベントと呼び出す API を一覧できる
- `ui.render` の hook でプロンプトの上の帯状の領域やペインに独自の UI を描画したり、Claude Code 自身の UI を書き換えたりできる
- `claude plugin test` を使うと、セッションなしでツール呼び出しや描画を発生させて mod をテストできる
- hook が `next` を呼ぶ前に失敗すると Claude Code はその hook をスキップするため、ガード用の hook は `.catch` で失敗時にもコマンドを止めるようにする
- mod はサンドボックス化されずユーザーの権限で動作するため、信頼できるものだけを導入する

## 参考

- [Mods overview - Claude Code Docs](https://code.claude.com/docs/en/plugins/mods/overview)
- [Create a mod - Claude Code Docs](https://code.claude.com/docs/en/plugins/mods/create)
- [React to events with a mod - Claude Code Docs](https://code.claude.com/docs/en/plugins/mods/events)
- [Draw in the interface with a mod - Claude Code Docs](https://code.claude.com/docs/en/plugins/mods/interface)
- [Mods reference - Claude Code Docs](https://code.claude.com/docs/en/plugins/mods/reference)
- [Customize Claude Code with mods in TypeScript | Claude](https://claude.com/blog/claude-code-mods)
- [Mods - make Claude 10x more extensible · Issue #91870 · anthropics/claude-code](https://github.com/anthropics/claude-code/issues/91870)
- [claude-code/mods at main · anthropics/claude-code](https://github.com/anthropics/claude-code/tree/main/mods)
