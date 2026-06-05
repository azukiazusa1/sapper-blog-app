---
id: Rqc7eUXoUYZWDtAdvoKnW
title: "エディタを Zed に乗り換えてみた"
slug: "editor-zed"
about: "Zed は Rust で書かれたネイティブアプリケーションで、非常に高速な動作と軽量な設計が特徴の新しいエディタです。この記事では、Zed のインストール方法と、実際に使ってみて感じた主要な機能や特徴について紹介していきたいと思います。"
createdAt: "2026-06-05T19:04+09:00"
updatedAt: "2026-06-05T19:04+09:00"
tags: ["zed"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1DDmqwLCQ9zLvAeD9L3TAS/67c62eb1f005b326521c428080c0d05d/kuma_sake_13180-768x610.png"
  title: "鮭を咥えるクマのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "ACP について、記事で正しく説明されているのはどれですか?"
      answers:
        - text: "Anthropic が開発した、AI モデルとアプリケーション間の通信プロトコル"
          correct: false
          explanation: "記事では ACP は Zed により開発されたと説明されています。Anthropic ではありません。"
        - text: "GitHub が提供する、エディタ拡張機能向けの通信仕様"
          correct: false
          explanation: "ACP は GitHub ではなく Zed が開発したプロトコルです。"
        - text: "Zed が開発したオープンなプロトコルで、エージェントとエディター間の通信を標準化する"
          correct: true
          explanation: "記事で説明されている通り、ACP（Agent Client Protocol）は Zed により開発されたオープンなプロトコルで、エージェントとエディター間の通信を標準化します。"
        - text: "MCP（Model Context Protocol）の別名として使われる業界標準"
          correct: false
          explanation: "ACP と MCP は別物です。記事では ACP は Zed が独自に開発したプロトコルとして紹介されています。"
    - question: "Zed から Claude エージェントを呼び出す際の使用量の扱いとして、記事で説明されているのはどれですか?"
      answers:
        - text: "月次で追加されるクレジット残高から消費される"
          correct: true
          explanation: "記事で説明されている通り、Zed から Claude を利用するのはサードパーティーツールを介した使用に該当し、月次のクレジット残高から消費されます。"
        - text: "ファーストパーティー利用と同じ扱いで、サブスクリプションの制限内で自由に使える"
          correct: false
          explanation: "記事では、ファーストパーティーツールを介した場合はサブスクリプション内で使えますが、Zed 経由はサードパーティー扱いになると説明されています。"
        - text: "Zed のサブスクリプション料金に含まれており、追加費用はかからない"
          correct: false
          explanation: "記事ではそのような説明はなく、Claude の月次クレジット残高から消費されると説明されています。"
        - text: "API キーを別途設定した場合のみ、従量課金で請求される"
          correct: false
          explanation: "記事では API キーによる設定ではなく ACP レジストリ経由でインストールする方法が紹介されており、使用量はクレジット残高から消費されると説明されています。"
published: true
---

思えばエンジニアとして生を受けてから、大半の時間を Visual Studio Code を相棒としてコードを書いていました。私がはじめて VS Code に出会ったときの衝撃といえばはかりしれないものでした。当時は Sublime Text や Atom などのエディタが主流だった中で、VS Code は軽快な動作と豊富な拡張機能、そして IDE とエディタのちょうど中間のような絶妙な立ち位置で、まさにエンジニアの理想を体現したエディタでした。以来、VS Code は私のコードを書くためのホームとなり、テーマやキーバインディングをカスタマイズし、数え切れないほどの拡張機能を試しては自分好みの環境を作り上げてきました。

エンジニアにとってエディタは単なる道具という言葉でくくるには少し足りない存在で、1 日の大半の時間をエディタとともに過ごしていたと言っても過言ではないでしょう。しかし、近年はそのような風潮も変わりつつあるように感じます。転換のきっかけはやはりコーディング AI エージェントの登場です。2026 年頃からエージェントの性能が飛躍的に向上した結果、人間が直接コードを書くのではなく要件定義や設計、コードレビューと検証といった判断や指示を出す役割にシフトしてきているように感じます。エージェントに指示を出すためのターミナルやデスクトップアプリがコーディングの時間に過ごす新たな場所に移り、エディタはコードを書くための場所から、コードを読み解くための場所へと変わってきているように思います。

このような状況でエディタに求められる役割というものも変わりました。高度な機能を持っている必要はなく、軽量に動くということが何より求められているように感じます。VS Code は非常に優れたエディタですが、Electron ベースのアプリケーションであるため、起動や動作が重いと感じることもありました。そんな中で、Zed という新しいエディタが注目を集めています。Zed は Rust で書かれたネイティブアプリケーションで、非常に高速な動作と軽量な設計が特徴です。私も最近 Zed に乗り換えてみて、その高速な動作とシンプルなインターフェースにすっかり魅了されてしまいました。

この記事では、Zed のインストール方法と、実際に使ってみて感じた主要な機能や特徴について紹介していきたいと思います。

## インストール

MacOS の場合、[ダウンロードページ](https://zed.dev/download) からインストーラーをダウンロードしてインストールするか、Homebrew を利用してインストールできます。

```bash
brew install --cask zed
```

プレビュー版を利用する場合は以下のコマンドでインストールできます。

```bash
brew install --cask zed@preview
```

Homebrew でインストールした場合 `zed` コマンドが利用できるようになります。VS Code などのエディタで `code .` コマンドを利用している場合は、同様に `zed .` コマンドで Zed を起動できるようになります。

```bash
zed .
```

インストーラーからインストールした場合は、アプリケーションフォルダから Zed を起動できます。`zed` コマンドを利用できるようにするには、Zed を起動してから `cmd + shift + p` でコマンドパレットを開いて `Install cli binary` を選択してインストールする必要があります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5NUXWgD6MCxfynCbSKT44o/d46e534403c09c16225fd69c326900a9/image.png)

はじめて開くプロジェクトでは安全のため制限モードで起動する警告が表示されます。制限モードではプロジェクトの設定が読み込まれなかったり、LSP や MCP サーバーなどの機能が利用できません。プロジェクトが信頼できるものであれば、「Trust and continue」を選択して制限モードを解除してプロジェクトを開きます。

## 主要な機能の紹介

コマンドパレットから `import vscode settings` を選択することで、VS Code の主要な設定を Zed にインポートできます。キーバインディングも VS Code スタイルに設定されるので、VS Code からの乗り換えもスムーズに行うことができました。

![](https://images.ctfassets.net/in6v9lxmm5c8/5Q2zZyLqBfsAZNdQVDdiGL/038735c383418d14f0f26cc79ac20af4/image.png)

デフォルトではファイルエクスプローラーが右のサイドバーに表示されるようになっているので、普段遣いの VS Code に近いレイアウトにするために、ファイルエクスプローラーを左のサイドバーに移動しました。ボトムバーのファイルエクスプローラーのアイコン（青色になっているアイコン）を右クリックして「Dock Left」を選択することで、ファイルエクスプローラーを左のサイドバーに移動できました。

![](https://images.ctfassets.net/in6v9lxmm5c8/1cANfArE60YQofun9b7PGu/b806e10ffc1ffa521da3e023df4dc649/image.png)

同様に Git Panel も左のサイドバーに移動しました。Git Panel は VS Code のソース管理パネルに近い機能を提供していて、変更されたファイルの一覧や変更内容の差分、コミットの作成などが行えます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2PLbYyGaSaHYpy7Uu5QX6R/0b726bbee7da5f5a413dff69060309d6/image.png)

画面上部に現在のブランチ名が表示されているので、ここをクリックすることでブランチの切り替えや新しいブランチの作成なども行うことができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1xSbJb8imRBLzJM4vBstG2/fcea79d487d127f39defed7638622759/image.png)

`cmd + shift + f` でプロジェクト全体を検索できます。検索を確定するまで結果が表示されないので、VS Code のようにリアルタイムで検索結果が表示されるわけではありませんが、検索結果の表示はかなり高速で、数千ファイルのプロジェクトでも一瞬で検索結果が表示されました。「Toggle Replace」をクリックすることで、検索した文字列を置換できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3GsoHW8jfIojUBTIaHo2nm/d4ce21edbb1a5d0d57434fa69ae68d6d/image.png)

`control + shift + @` もしくはボトムバーのアイコンからターミナルを開くことができます。ターミナルはエディタの下部に表示され、複数のターミナルを開いて切り替えることもできます。使いごこちは VS Code のターミナルに近い感じですね。

![](https://images.ctfassets.net/in6v9lxmm5c8/65SJOisocmfHdxcC9uKaSW/0464ee3d0796dfef4d0b4faf9433629b/image.png)

特に拡張機能などをインストールしていなかったのですが、コード上から Vitest のテストを直接実行できました。コードの行番号の左側に再生アイコンが表示されていて、アイコンをクリックすることでテストを実行できます。テストの実行結果はターミナルに表示されるようになっています。Jest, Vitest, Bun, Node などの主要なテストフレームワークがサポートされているようです。

![](https://images.ctfassets.net/in6v9lxmm5c8/5AnOUkQFsZNUYOtdZ4ErSz/c2c36681e31c325163371d4a18d64c9d/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/EeHWfAsdMPjLsnKJGCf4E/380d5592203a578c974c1269786b151c/image.png)

ファイル保存時のフォーマットもデフォルトでサポートされているようです。デフォルトでは TypeScript 組み込みのフォーマッターが使用されますが、多くのプロジェクトでは Prettier や Oxfmt などのフォーマッターが使用されていることでしょう。その場合 Zed の設定ファイルに以下のような設定を追加します。プロジェクトに関する設定はプロジェクトルートの `.zed/settings.json` に記述するのが良いでしょう。コマンドパレットから `zed: open project settings file` を選択すると `.zed/settings.json` を開くことができます。

```json:.zed/settings.json
{
  "languages": {
    "JavaScript": {
      "formatter": {
        "external": {
          "command": "prettier",
          "arguments": ["--stdin-filepath", "{buffer_path}"]
        }
      }
    }
  }
}
```

ファイルを保存した時に ESLint を実行する場合は以下のような設定を追加します。

```json:.zed/settings.json
{
  "languages": {
    "JavaScript": {
      "code_actions_on_format": {
        "source.fixAll.eslint": true
      }
    }
  }
}
```

## Zed と AI エージェント

Zed には AI 機能が組み込まれているようで、エージェントパネルからプロジェクトのコードを読み書きできるエージェントに指示を出したり、コード補完を有効にできます。AI 機能を利用するには、Zed ネイティブの [Zed Agent](https://zed.dev/docs/ai/zed-agent) を使用するか、Claude Code, Codex, GitHub Copilot などのサードパーティーの AI エージェントを利用する方法があります。サードパーティーの AI エージェントと直接やり取りできるのは [ACP(Agent Client Protocol)](https://agentclientprotocol.com/get-started/introduction) と呼ばれるプロトコルにより実現されているようです。ACP は Zed により開発されたオープンなプロトコルで、エージェントとエディター間の通信を標準化するためのプロトコルです。

https://zed.dev/blog/bring-your-own-agent-to-zed

ここでは試しに Claude を Zed のエージェントパネルから呼び出せるようにしてみます。Claude のサブスクリプションでは、Anthropic のファーストパーティツールを介して使用する場合と、サードパーティーツールを介して使用する（`claude -p`）場合で使用量の消費が異なる点に注意してください。前者はサブスクリプションの制限内で自由に利用できますが、後者の場合は月次で追加されるクレジット残高から使用量が消費されます。Zed から Claude エージェントを呼び出すのはサードパーティーツールを介した仕様に該当します。
https://zed.dev/blog/anthropic-subscription-changes

サードパーティーの AI エージェントをインストールするには ACP レジストリを使用するのが一般的です。コマンドパレットから `zed: acp registry` を選択して ACP レジストリを開きます。一覧から「Claude Agent」を選択して「Install」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/7IznkSwOy7BgARNBNv2h7F/4e6bc3a00b4924f679e7791a261847f5/image.png)

インストールが完了すると、エージェントパネルの上部メニューから「Claude Agent」を選択できるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5UtflbMCuD05pks5KP19Ol/a2b0163b0b752f81d9eed2922b438a45/image.png)

Claude Code で既に認証が完了している場合は、Zed からもそのまま Claude とやり取りできるようになります。プロジェクトの `CLAUDE.md` ファイルも読み込まれ、スキルやコマンドもそのまま利用できるようになっています。`@` でファイルを指定しつつ指示を出すこともできます。

![](https://images.ctfassets.net/in6v9lxmm5c8/37dfSoCgSawgnY3mrKxjzi/2e52a24734d7dd50206091e292df05a3/image.png)

## コード補完のために GitHub Copilot を有効にする

続いてコード補完のために GitHub Copilot を有効にしてみます。まずはコマンドパレットから `zed: open settings file` を開いて Zed の設定ファイルを開きます。`~/.config/zed/settings.json` が開かれるので、以下の設定を追加して保存します。

```json:.config/zed/settings.json
{
  "edit_predictions": {
    "provider": "copilot"
  }
}
```

この設定を追加するとボトムバーに GitHub Copilot のアイコンが表示されるようになります。アイコンをクリックして「Sign in to Copilot」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/3ykgsjksLV8jW8pWGuvTWB/2a9bde28ae8854c83f0c44c65bbae865/image.png)

ダイアログで認証コードが表示されるので、表示されたコードをコピーして「Connect to GitHub」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/4NWwbwbYRSz9GB2xio3Hkd/a3d7aa250d30f630ad9f1bee3f684ee9/431a72af-478a-4c34-be8b-4e43a9394e17.png)

ブラウザが開いて GitHub の認証画面が表示されるので、GitHub アカウントでサインインして進めます。認証コードを入力する画面が表示されるので、先ほどコピーしたコードを入力して「Continue」をクリックします。認証が完了すると Zed に戻ってきて「Copilot Enabled!」と表示されていれば GitHub Copilot が有効になっています。

試しにエディタ上で何かしらのコードを書いてみると、GitHub Copilot がコード補完の候補を表示してくれるようになります。VS Code の GitHub Copilot と同様に、`tab` キーで候補を受け入れることができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/W8nSvUo8sWiaFGwqbJ4EF/a88e99026c5a62e0276568f331fb36fa/image.png)

## 拡張機能のインストール

VS Code と同様に、Zed も拡張機能をインストールすることで機能を追加できます。とはいえ私自身はエディタ上での高度な機能をあまり必要としなくなっていたり、サプライチェーン攻撃の増加傾向にある昨今の状況も踏まえると、あまり多くの拡張機能をインストールするべきではないように感じています。コマンドパレットから `zed: extensions` を選択することで、利用可能な拡張機能の一覧が表示されます。「Install」ボタンをクリックすることで拡張機能をインストールできます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4T7rfnguSJd1FafmGFqQMW/5c03c5133d66d53e1d84e7e46bca5834/image.png)

自分自身で拡張機能を作成したい場合には、Rust で開発し GitHub リポジトリに公開する必要があります。リポジトリは [zed-industries/extensions](https://github.com/zed-industries/extensions) のサブモジュールとしてリンクされる必要があります。詳しくは [Developing Extensions](https://zed.dev/docs/extensions/developing-extensions) ドキュメントを参照してください。

## 参考

- [Getting Started | Getting Started with Zed](https://zed.dev/docs/getting-started)
- [Zed — From The Blog](https://zed.dev/blog)
