---
id: Gqo7HrTmqnpDo56CjKO2e
title: "Codex を利用した iOS アプリ開発を試してみた"
slug: "ios-app-development-with-codex"
about: "私自身は Web 開発の経験はありますが、iOS アプリ開発の経験はほとんどありません。このようなバックグラウンドを持つ私がコーディングエージェントである Codex を利用して iOS アプリ開発をどこまで進められるか試してみました。コーディングエージェントは単に中身を見ずにアプリケーションを作るいわゆる「バイブコーディング」的な使い方だけでなく、なぜこのコードが必要なのか？より良い設計にできないか？といったことを随時質問しながら進める学習用途の使い方が中心です。"
createdAt: "2026-05-04T11:54+09:00"
updatedAt: "2026-05-04T11:54+09:00"
tags: ["codex", "ios", "SwiftUI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7lOrkKlhi3uEm418yPS0kA/edbe20537ac7076c735b66e332565898/shoebill_22981.png"
  title: "ハシビロコウのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "TodoItem 構造体に Identifiable プロトコルを適用する目的として、記事で説明されているものはどれですか？"
      answers:
        - text: "TodoItem を JSON 形式にエンコード・デコードできるようにする"
          correct: false
          explanation: "JSON のエンコード・デコードを可能にするのは Codable プロトコルです。Identifiable は一意識別のために使います。"
        - text: "TodoItem 同士を == 演算子で比較できるようにする"
          correct: false
          explanation: "== 演算子による比較を可能にするのは Equatable プロトコルです。Identifiable は異なる用途です。"
        - text: "TodoItem が一意に識別できることを示し、SwiftUI の List などでアイテムを識別するために使う"
          correct: true
          explanation: "記事の説明通りです。Identifiable に準拠することで SwiftUI の ForEach などがアイテムを識別できるようになります。React でいう key に近い概念とも説明されています。"
        - text: "TodoItem のプロパティが変更されたときにビューを自動更新する"
          correct: false
          explanation: "ビューの自動更新は @State などが担います。Identifiable は一意識別のためのプロトコルです。"
    - question: "リスト内の各行に .contentShape(Rectangle()) モディファイアを付ける理由として、記事で説明されているものはどれですか？"
      answers:
        - text: "行の背景を長方形で塗りつぶしてデザインを整えるため"
          correct: false
          explanation: "contentShape は見た目のスタイルではなく、タッチ操作の有効範囲を制御するためのモディファイアです。"
        - text: "タップジェスチャーの有効範囲を行全体の長方形領域に広げるため"
          correct: true
          explanation: "記事の通りです。contentShape(Rectangle()) がないとテキスト部分だけがタップ可能になってしまうため、行全体をタップ可能にするために使います。"
        - text: "行の角を丸くせず四角形のまま保つため"
          correct: false
          explanation: "角の形状を保つ目的では使いません。contentShape はジェスチャーのヒットテスト範囲を指定するためのモディファイアです。"
        - text: "セルの高さを自動計算して等間隔に並べるため"
          correct: false
          explanation: "セル高さの自動計算は List が行う処理で、contentShape の役割ではありません。"
    - question: "Swift の try? について、記事で説明されている挙動として正しいものはどれですか？"
      answers:
        - text: "エラーが発生した場合にアプリがクラッシュする"
          correct: false
          explanation: "クラッシュするのは try! の挙動です。記事では try! はエラーが絶対に発生しないとわかっている場合にのみ使うべきと説明されています。"
        - text: "エラーが発生した場合に nil を返す"
          correct: true
          explanation: "記事の説明通りです。try? を使うとエラー発生時に nil が返るため、do-catch で個別にエラーを捕捉する必要がなくなります。"
        - text: "エラーが発生した場合に空文字列を返す"
          correct: false
          explanation: "try? はエラー時に空文字列ではなく nil を返します。戻り値の型はオプショナル型になります。"
        - text: "エラーを無視して正常終了したかのように処理を続行する"
          correct: false
          explanation: "try? はエラーを無視するのではなく、エラー時に nil を返すことで呼び出し側が nil チェックで対処できるようにします。"

published: true
---

AI エージェントの登場はコーディングの民主化というムーブメントをもたらしました。AI エージェントは、専門的な知識やスキルがなくても、自然言語で指示を与えるだけでコードを書いてくれるため、これまでプログラミングにアクセスできなかった人々も自分のアイデアを形にできるようになりました。私自身は Web 開発の経験はありますが、iOS アプリ開発の経験はほとんどありません。このようなバックグラウンドを持つ私がコーディングエージェントである Codex を利用して iOS アプリ開発をどこまで進められるか試してみました。コーディングエージェントは単に中身を見ずにアプリケーションを作るいわゆる「バイブコーディング」的な使い方だけでなく、なぜこのコードが必要なのか？より良い設計にできないか？といったことを随時質問しながら進める学習用途の使い方もできます。今回は学習用途の使い方を中心に試してみました。

Codex のユースケースページには iOS アプリ開発の例も紹介されているため、これを参考にしながら実際に試してみます。

## SwiftUI プロジェクトを作成する

まずは Codex と協力しながら SwiftUI プロジェクトを作成してみます。SwiftUI を使用して開発するために、あらかじめ [build-ios-apps プラグイン](https://github.com/openai/plugins/tree/main/plugins/build-ios-apps)をインストールしておきます。このプラグインは以下のスキルを提供します。

- `ios-debugger-agent`: `XcodeBuildMCP` を使って iOS シミュレータ上でビルド, 起動, UI 操作, スクリーンショット, ログ取得、デバッグを行うためのスキル
- `ios-ettrace-performance`: `ettrace` を使って iOS シミュレータ上でアプリのパフォーマンスを分析するためのスキル
- `ios-memgraph-leaks`: `memgraph` を使って iOS シミュレータ上でアプリのメモリリークを分析するためのスキル
- `ios-app-intents`: App Intents を使ってアプリの機能を Siri やショートカットから呼び出せるようにするためのスキル
- `swiftui-liquid-glass`: Liquid Glass API を SwiftUI UI に適用するためのスキル
- `swiftui-performance-audit`: SwiftUI UI のパフォーマンスを監査するためのスキル
- `swiftui-ui-patterns`: SwiftUI UI の設計のベストプラクティスパターン
- `swiftui-view-refactor`: SwiftUI View のリファクタリングを支援するためのスキル

Codex App を使用している場合、左サイドバーの「プラグイン」をクリックし、検索バーに「build-ios-apps」と入力してプラグインを選択します。「+」ボタンをクリックしてプラグインをインストールします。

![](https://images.ctfassets.net/in6v9lxmm5c8/7Cor31XVb1g0LgA4xnqWgh/0f5a5a86418b5040f6f970b76f87bced/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/3tNmzH2RRSPQT5NYMPPTKC/d20701a45e54de7d22c65115df5f70b3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-05-04_12.10.56.png)

Codex のユースケースページでスタータープロンプトが紹介されているので、これを参考にプロジェクトの作成を試してみます。

```txt
SwiftUI のスターター アプリをスキャフォールディングし、ローカル環境の `Build` アクションに接続できるビルドおよび起動スクリプトを追加します。

制約:
- CLI を優先します。Apple の `xcodebuild` を優先します。よりクリーンな設定が役立つ場合は、Tuist を使用しても構いません。
- このリポジトリに完全な Xcode プロジェクトが含まれている場合は、XcodeBuildMCP を使用してターゲットを一覧表示し、適切なスキームを選択し、ビルド、起動、およびイテレーション中にスクリーンショットをキャプチャします。
- 既存のモデル、ナビゲーション パターン、および共有ユーティリティが既に存在する場合は、それらを再利用します。
- Apple プラットフォームの共有実装を明示的に要求しない限り、アプリは iPhone と iPad に特化します。
- 変更のたびに、信頼できる小さな検証ループを使用し、より狭いチェックがパスした場合にのみ、より広いビルドに拡張します。
- これを新規スキャフォールディングとして扱ったのか、既存プロジェクトの変更として扱ったのかを教えてください。提供物：
  - アプリのスキャフォールドまたは要求された機能スライス
  - 正確なコマンドを含む小さなビルドおよび起動スクリプト
  - 実行した最小限の関連検証手順
  - 使用した正確なスキーム、シミュレータ、およびチェック
```

このプロンプトを Codex に与えると、Codex は以下のようなプロジェクト構成を作成してくれました。

```sh
ios-app-example
├── README.md
├── scripts
│   ├── build.sh
│   ├── run.sh
│   └── screenshot.sh
├── StarterApp
│   ├── Assets.xcassets
│   │   ├── AppIcon.appiconset
│   │   │   └── Contents.json
│   │   └── Contents.json
│   ├── ContentView.swift
│   └── StarterApp.swift
└── StarterApp.xcodeproj
    ├── project.pbxproj
    └── xcshareddata
        └── xcschemes
            └── StarterApp.xcscheme

8 directories, 10 files
```

### プロジェクトの構成

プロジェクトの構成についてもどのファイルがどの役割を果たしているのか理解できていなかったため、「プロジェクトの構成について簡単に説明してください。」といった質問を Codex に投げました。Codex の説明を元に主要ファイルを順に追って見てきます。

`StarterApp.xcodeproj` は XCode のプロジェクトファイルで、プロジェクトの構成やビルド設定などが記述されています。`project.pbxproj` にはプロジェクトの構成やビルド設定が記述されており、`xcschemes` ディレクトリにはビルドや起動のスキームが記述された XML ファイルが含まれています。

`StarterApp.swift` はアプリのエントリーポイントとなるファイルで、`@main` アノテーションが付与された `StarterApp` 構造体が定義されています。

```swift:StarterApp/StarterApp.swift
import SwiftUI

@main
struct StarterApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

`var body` は画面に何を表示するかを定義するプロパティです。返す値は `some Scene` として宣言されており、これは `Scene` に準拠した何らかの型を返すことを意味しています。`Scene` とはアプリの表示単位を表し、iOS では通常 `WindowGroup` が使用されます。`WindowGroup` は複数のウィンドウを管理するためのコンテナで、ここでは `ContentView` を表示するように定義されています。

`ContentView` は同じディレクトリにある `ContentView.swift` で定義されており、画面に表示する内容を定義しています。

```swift:StarterApp/ContentView.swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationStack {
            List {
                Section {
                    Label("SwiftUI starter is ready", systemImage: "sparkles")
                    Label("Configured for iPhone and iPad", systemImage: "iphone.gen3")
                    Label("Builds with xcodebuild", systemImage: "hammer")
                }
            }
            .navigationTitle("StarterApp")
        }
    }
}

#Preview {
    ContentView()
}
```

`ContentView` 構造体も同様に `var body` プロパティを持っています。ここでは `NavigationStack` と `List` を使用して、いくつかのラベルを表示するシンプルな画面が定義されています。ここではまだナビゲーションが実装されていないため、タップしても何も起こりません。実際にナビゲーションを実装するには `NavigationLink` を使用して、遷移先のビューを定義する必要があります。

`#Preview` は XCode の Canvas でプレビューを表示するための構文です。これによりアプリ全体をビルドせずとも、`ContentView` の見た目を確認できます。先頭の `#` はコンパイラがこのコードを特別な方法で処理するマクロであることを示しています。`#Preview { ContentView() }` の場合は XCode のプレビュー機能が読める形のコードに展開されます。`#Preview` マクロは Xcode 15 で導入された新しい仕組みで、それ以前は `PreviewProvider` プロトコルを使って以下のように記述する必要がありました。概念的なイメージとして参考程度に見てください。

```swift
// Xcode 15 以前の記法（概念的なイメージ）
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

`StarterApp/Assets.xcassets` ディレクトリにはアプリで使用する画像やアイコンなどのアセットが格納されます。今は空の App Icon 定義だけが含まれています。`"idiom" : "universal"` はこのアイコンが特定のデバイス専用ではなく、共通で使用されることを意味します。昔の iOS アプリ開発では iPhone 用・iPad 用・Apple Watch 用など、デバイスごとに異なるアイコンを用意する必要がありましたが、最近の iOS ではユニバーサルなアイコンを用意すれば、すべてのデバイスで使用できるようになっています。

```json:StarterApp/Assets.xcassets/AppIcon.appiconset/Contents.json
{
  "images" : [
    {
      "idiom" : "universal",
      "platform" : "ios",
      "size" : "1024x1024"
    }
  ],
  "info" : {
    "author" : "xcode",
    "version" : 1
  }
}
```

`scripts/build.sh` はビルド、`scripts/run.sh` は起動、`scripts/screenshot.sh` はスクリーンショットを撮るためのスクリプトです。これらのスクリプトは `xcodebuild` コマンドを使用してビルドや起動をします。

```sh:scripts/build.sh
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="${PROJECT:-$ROOT_DIR/StarterApp.xcodeproj}"
SCHEME="${SCHEME:-StarterApp}"
CONFIGURATION="${CONFIGURATION:-Debug}"
SIMULATOR="${SIMULATOR:-iPhone 16}"
DERIVED_DATA="${DERIVED_DATA:-$ROOT_DIR/.build/DerivedData}"

xcodebuild \
  -project "$PROJECT" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -destination "platform=iOS Simulator,name=$SIMULATOR" \
  -derivedDataPath "$DERIVED_DATA" \
  build
```

`xcodebuild` コマンドは XCode プロジェクトをビルド・テスト・アーカイブするためのコマンドラインツールです。XCode 上で行う操作をコマンドラインで実行できるようにするもので、CI/CD 環境などでよく使用されます。

### XCode のインストールと xcode-select の設定

手元の環境では XCode をインストールしていなかったため、Codex が `xcodebuild` コマンドを使用してビルドや起動はできませんでした。「Xcode 本体を入れて xcode-select を Xcode に向けるためにはどうすればいい？」といった質問を Codex に投げると、App Store から XCode をインストールするか、Apple Developer のサイトからダウンロードする方法を教えてくれました。XCode をインストールした後以下のコマンドを実行して xcode-select を XCode に向けます。

```sh
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
xcodebuild -version
xcrun simctl list devices available
```

### シミュレータを起動して表示を確認する

`xcodebuild` コマンドが利用できるようになったので、実際にシミュレータを起動してみます。「シミュレータを起動してみたいのですが、どうすればいいですか？」といった質問を Codex に投げると `scripts/run.sh` を実行する方法を教えてくれました。

```sh
./scripts/screenshot.sh
```

このコマンドを実行したら `No devices are booted.` という文言が出力されました。シミュレーターがインストールされておらず、起動できていないことが原因だと思いますが、この文言が出力されたことを Codex に伝えて解決策を質問してみます。回答としては、まずシミュレータを起動するためのコマンドを教えてくれました。

```sh
xcrun simctl boot "iPhone 16"
```

しかし、`Invalid device or device pair: iPhone 16` というエラーが出力されてしまいました。シミュレータの名前が正しくない可能性があるため、利用可能なシミュレータの一覧を取得する方法を質問してみました。以下のコマンドで利用可能なシミュレータの一覧を取得できます。

```sh
xcrun simctl list devices available
```

この結果も空になってしまいました。さらに質問してみたところ、そもそも iOS Simulator Runtime がインストールされていない可能性があることがわかりました。XCode から iOS Simulator Runtime をインストールする方法を進められたので、作成したプロジェクトを選択して XCode を起動しました。XCode の上部のバーに iOS Simulator Runtime をインストールするための UI が表示されていたので、これをクリックしてインストールを行いました。インストールが完了した後に `xcrun simctl list runtimes` コマンドを実行してみたところ、利用可能なランタイムの一覧が表示されるようになりました。

```sh
xcrun simctl list runtimes

== Runtimes ==
iOS 26.4 (26.4.1 - 23E254a) - com.apple.CoreSimulator.SimRuntime.iOS-26-4
```

同様にシミュレーターの一覧も追加されています。

```sh
xcrun simctl list devices available

== Devices ==
-- iOS 26.4 --
    iPhone 17 Pro (72C743B5-0CB9-4409-A216-99BDE91FB8D0) (Shutdown)
    iPhone 17 Pro Max (BD4FE420-5126-4E07-B466-8BF999043A75) (Shutdown)
    iPhone 17e (30A67785-9E82-4716-BAEF-9195220F1339) (Shutdown)
    iPhone Air (A69EE615-67A4-405E-8252-F44EFD21395B) (Shutdown)
    iPhone 17 (94AF3B02-0BF4-4208-9D8B-A685BDF826C3) (Shutdown)
    iPad Pro 13-inch (M5) (65AC1C77-C683-4A8D-AE5A-79922CBF60E5) (Shutdown)
    iPad Pro 11-inch (M5) (53B29E6F-F194-4E31-A834-343A49F13DF4) (Shutdown)
    iPad mini (A17 Pro) (5A9DA769-10CE-4B75-B48C-42C8B6FA1E5D) (Shutdown)
    iPad Air 13-inch (M4) (D0AEAC7A-3CA2-4DB5-B895-D3FA81EE52A3) (Shutdown)
    iPad Air 11-inch (M4) (51078F7F-D1F6-4325-A8CD-8CE33D82345C) (Shutdown)
    iPad (A16) (B5BC4B45-01BE-4A2D-A911-317D391360C8) (Shutdown)
```

今回追加されたシミュレータは iPhone 17 ですから、`scripts/run.sh` と `scripts/build.sh` の中の `SIMULATOR` の値を `iPhone 17` に変更する必要がありそうです。

```diff:scripts/run.sh
  #!/usr/bin/env bash
  set -euo pipefail

  ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
  CONFIGURATION="${CONFIGURATION:-Debug}"
- SIMULATOR="${SIMULATOR:-iPhone 16}"
+ SIMULATOR="${SIMULATOR:-iPhone 17}"
  DERIVED_DATA="${DERIVED_DATA:-$ROOT_DIR/.build/DerivedData}"
  BUNDLE_ID="${BUNDLE_ID:-com.example.StarterApp}"
  APP_PATH="$DERIVED_DATA/Build/Products/$CONFIGURATION-iphonesimulator/StarterApp.app"
```

この状態で再度 `./scripts/run.sh` を実行してみます。`** BUILD SUCCEEDED **` の表示が出力されたら、その後 `./scripts/screenshot.sh` を実行してスクリーンショットを取得します。このスクリプトでは `xcrun simctl io booted screenshot ${OUTPUT_PATH}` コマンドを使用してシミュレータのスクリーンショットを取得しています。

![](https://images.ctfassets.net/in6v9lxmm5c8/CXZ3aYzNzF2eTNJ6CLkBV/b009a062af9e43454d22c6948c309aa9/starterapp.png)

シミュレーター上のスクリーンショットを撮って確認するほか、XCode の Canvas 上でプレビューを確認もできるようですね。

![](https://images.ctfassets.net/in6v9lxmm5c8/31qbQZyvy2YH8EDhS6V65b/95dc07a2c266a762edfe3adb411983f5/image.png)

## TODO アプリケーションの作成

プロジェクトの構成やビルド・起動の方法がわかったので、次は簡単な TODO アプリケーションを作成してみます。新しいセッションを開始して、Codex のユースケースページで紹介されているプロンプトを参考にして、TODO アプリケーションを作成するためのプロンプトを与えます。`XcodeBuildMCP` や CLI ツールを使用して、Codex 自身がフィードバックループを回せるようにするためのプロンプトになっています。

```txt
この SwiftUI アプリに TODO リストの機能を追加してください。

## 要件

- TODO アイテムを追加するためのテキストフィールドとボタンを追加してください。
- TODO アイテムをリスト表示してください。完了したアイテムはリストの下部に表示してください。
- TODO アイテムをタップすると、完了状態が切り替わるようにしてください。
- TODO アイテムを左スワイプすると削除できるようにしてください。
- データはローカルに保存してください。アプリを再起動しても TODO アイテムが保持されるようにしてください。

## 制約

- XcodeBuildMCP を使用して、適切なターゲットまたはスキームを一覧表示し、アプリをビルドして起動し、視覚的な検証が必要な場合はスクリーンショットをキャプチャしてください。
- 明示的に iOS/macOS 共通の抽象化を要求しない限り、実装は iPhone と iPad に絞ってください。
- 使用したスキーム、シミュレータ、およびチェックを正確に教えてください。スライスを実装し、関連する最小限のビルド ループまたは実行ループで検証し、変更点を要約してください。
```

まずはプランモードで計画を立ててもらいます。`build-ios-apps:swiftui-ui-patterns` と `build-ios-apps:ios-debugger-agent` のスキルを参照しつつ、TODO アプリケーションを作成するためのタスクをいくつかに分割してくれました。`ContentView` のコードに全ての実装を入れようとしていて、素人目から見てもあまり良い設計ではなさそうだったのですが、この後リファクタリングのスキルも試してみたかったので、あえてこのまま実装に入ってもらうことにしました。

![](https://images.ctfassets.net/in6v9lxmm5c8/7DRU1X2NYnOHmqxULUI2oL/cb0063b26d1a58e2b41537fd22598b6d/image.png)

コードの実装自体はすぐに完了し、検証のための作業に大半の時間を費やしていました。検証作業は主に [XcodeBuildMCP](https://www.xcodebuildmcp.com/) を使用して行われました。主に以下のようなツールを使用していました。

- `mcp__xcodebuildmcp__.list_schemes`: 利用可能なスキームの一覧を取得。スキームとは、ビルドや起動の設定をまとめたもので、どのターゲットをビルドするのか、どのシミュレータで起動するのかなどが定義されている
- `mcp__xcodebuildmcp__.build_run_sim`: ツールビルドとシミュレータを起動する
- `mcp__xcodebuildmcp__.screenshot`: スクリーンショットを取得

UI 操作には [Computer Use](https://developers.openai.com/codex/app/computer-use) ツールを使用していました。これは Codex が macOS 上の GUI を見て、クリックや入力、画面遷移を行えるようにする機能です。Computer Use ツールを使用するためにはアクセシビリティと画面収録とシステム録音の許可が必要になります。これらはシステム設定 → プライバシーとセキュリティから設定できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/31qbQZyvy2YH8EDhS6V65b/95dc07a2c266a762edfe3adb411983f5/image.png)

Codex が実装したコードについていくつか質問をしてみて、SwiftUI のコードの理解を深めていきましょう。コードの質問をする際には「私は普段 Web 開発をしていて、特に React に慣れ親しんでいますが、iOS アプリ開発の経験はほとんどありません。iOS アプリ開発特有の概念があればより詳しく説明したり、React でいうところのどの部分に相当するのかといった説明を加えてください。」といった前提情報を加えると、自身に適した説明をしてくれるようになります。

### TodoItem の構造体の説明と let と var の違い

まずは `struct TodoItem` の `Codable, Equatable, Identifiable` という部分と `let` と `var` の違いについて質問してみました。

```swift:ContentView.swift
struct TodoItem: Codable, Equatable, Identifiable {
    let id: UUID
    var title: String
    var isCompleted: Bool
    let createdAt: Date
}
```

```txt
私は普段 Web 開発をしていて、特に React に慣れ親しんでいますが、iOS アプリ開発の経験はほとんどありません。iOS アプリ開発特有の概念があればより詳しく説明したり、React でいうところのどの部分に相当するのかといった説明を加えてください。

struct TodoItem の `Codable, Equatable, Identifiable` とは何を意味していますか？また、`let` と `var` の違いについても説明してください。
```

そもそも struct とは何か？TypeScript のコード例を交えて説明してくれました。`struct` は TypeScript でいうところの `type` に近い概念で、データの構造を定義するためのものです。ただし Swift の `struct` はメソッドや computed property を持つことができます。

```ts
type TodoItem = {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: Date;
};
```

`let` は再代入できない定数を定義するためのキーワードで、`var` は再代入可能な変数を定義するためのキーワードです。例えば `title` はユーザーが入力した値を保持するために `var` で定義されているのに対して、`id` は一度生成されたら変更されることはないため `let` で定義されています。将来変更する必要がない変数やプロパティは `let` を使用して定義するという概念は共通するところがあるでしょう。

```swift
let id = UUID()
var title = "Buy milk"

title = "Buy oat milk" // OK
id = UUID()            // NG
```

`Codable, Equatable, Identifiable` は総称してプロトコルと呼ばれるものです。`struct TodoItem: Codable, Equatable, Identifiable` は `TodoItem` が `Codable`, `Equatable`, `Identifiable` というプロトコルに準拠していることを意味しています。プロトコルは特定のメソッドやプロパティを持つことを要求するもので、これに準拠することで特定の機能を利用できるようになります。このコードではプロトコルの実装を明示的に書いておらず、Swift のコンパイラが自動的に実装を生成してくれています。

それぞれのプロトコルの意味は以下の通りです。

- `Codable`: このプロトコルに準拠することで、`TodoItem` を JSON などの形式にエンコードしたり、逆にデコードしたりできるようになる。Todo アイテムをローカルに保存するために必要
- `Equatable`: このプロトコルに準拠することで、`TodoItem` 同士を `==` 演算子で比較できるようになる。
- `Identifiable`: このプロトコルに準拠することで、`TodoItem` が一意に識別できることを示す。SwiftUI の List などのコンポーネントでアイテムを識別するために必要。React でいうところの `key` に近い概念

### アプリケーションの状態管理と `@State` の説明

アプリケーションの状態管理の方法について見ていきましょう。`ContentView` 構造体のプロパティには `@State` が付与されているものがありますが、これらはアプリケーションの状態を管理するためのプロパティです。`@State` は SwiftUI にこのプロパティがビューの状態を表すものであることを伝えるためのもので、これにより SwiftUI はこのプロパティが変更されたときにビューを再描画する必要があることを認識します。React における `useState` フックと似たような役割を果たしています。

```swift:ContentView.swift
struct ContentView: View {
    @State private var newTodoTitle = ""
    @State private var todos: [TodoItem]

    var body: some View {
        // ...
    }
}
```

`newTodoTitle` はテキストフィールドにバインドされていることがわかります。先頭に `$` をつけることで、`newTodoTitle` を `string` としてではなく、`Binding<String>` として渡すことができます。`Binding` は双方向のデータフローを可能にするもので、テキストフィールドの値が変更されたときに `newTodoTitle` の値も更新されるようになります。

```swift:ContentView.swift
TextField("New TODO", text: $newTodoTitle)
```

アプリケーションの初期化時にローカルで保存した Todo アイテムを読み込む処理も必要です。`storage` プロパティを定義して、`init()` メソッドの中でローカルに保存されたデータを読み込む処理を実装しています。`@State` プロパティは通常プロパティ宣言時に `= []` のように初期値を与えますが、ストレージから動的に読み込んだ値で初期化したい場合は `init()` の中で行う必要があります。`_todos = State(initialValue: ...)` の形式で `@State` ラッパーのストレージに直接値をセットしています。

```swift:ContentView.swift
struct ContentView: View {
    private let storage = TodoStorage()

    init() {
        _todos = State(initialValue: storage.load())
    }
    // ...
}
```

`TodoStorage` はローカルにデータを保存するためのクラスで、`save` メソッドと `load` メソッドを持っています。これらのメソッドは `Codable` プロトコルに準拠した `TodoItem` の配列を JSON 形式で保存・読み込みするためのものです。それぞれ `JSONEncoder` と `JSONDecoder` を使用して、データをエンコード・デコードしています。

データの保存先として `UserDefaults` を使用しています。`UserDefaults` は iOS で簡単にキーと値のペアを保存できる仕組みで、ブラウザにおける `localStorage` に近い概念です。

```swift:ContentView.swift

private struct TodoStorage {
    private let key = "savedTodos"
    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
    }

    func load() -> [TodoItem] {
        guard let data = defaults.data(forKey: key) else {
            return []
        }

        do {
            return try JSONDecoder().decode([TodoItem].self, from: data)
        } catch {
            return []
        }
    }

    func save(_ todos: [TodoItem]) {
        do {
            let data = try JSONEncoder().encode(todos)
            defaults.set(data, forKey: key)
        } catch {
            defaults.removeObject(forKey: key)
        }
    }
}
```

コード内では `guard` と `do-catch` という構文が使用されています。`guard` は条件が満たされない場合に早期リターンするための構文です。`UserDefaults` から key に対応するデータを取り出すことに成功すればそのデータを `data` 定数に格納して次の処理に進みますが、失敗すれば `else` ブロックの処理が実行されて、空の配列が返されます。

`defaults.data(forKey: key)` の戻り値はオプショナル型で、データが存在しない場合は `nil` が返されますので、このように `guard` を使用してデータの存在を確認する必要があります。

```swift:ContentView.swift
guard let data = defaults.data(forKey: key) else {
    return []
}
```

`do-catch` はエラーが発生する可能性がある処理を囲むためのブロックです。`JSONDecoder().decode()` はデコード処理に失敗する可能性があるため、エラーを返す可能性がある関数です。エラーが発生する可能性がある関数は `try` キーワードを使用して呼び出す必要があります。`try` キーワードがなければコンパイルエラーとなります。

```swift:ContentView.swift
do {
    return try JSONDecoder().decode([TodoItem].self, from: data)
} catch {
    return []
}
```

`do-catch` の他に `try?` という構文もあります。`try?` を使用すると、エラーが発生した場合に `nil` を返すようになります。エラーの内容を知る必要がない場合や、エラーが発生しても特に問題ない場合には `try?` を使用できます。

```swift:ContentView.swift
return try? JSONDecoder().decode([TodoItem].self, from: data) ?? []
```

あるいは `try!` という構文もあります。`try!` を使用すると、エラーが発生した場合にクラッシュするようになるため、エラーが絶対に発生しないことがわかっている場合にのみ使用するべきです。

```swift:ContentView.swift
return try! JSONDecoder().decode([TodoItem].self, from: data)
```

### 画面の構成と SwiftUI のコンポーネント

`ContentView` の `body` プロパティの中で、画面の構成が定義されています。SwiftUI では、画面に表示する内容を `View` として定義します。ここでは `NavigationStack` と `List` を使用して、TODO アイテムのリストを表示しています。`List` はリスト表示のためのコンポーネントで、React でいうところの `ul` や `ol` に近い概念ですが、iOS のプラットフォームに最適化された機能が提供されています。例えば、リストアイテムのスワイプ操作や、セクションごとの区切りなどが簡単に実装できます。

```swift:ContentView.swift
var body: some View {
    NavigationStack {
        List {
            ...
        }
        .navigationTitle("TODOs")
    }
}
```

`Section` はリストのセクションを定義するためのコンポーネントで、セクションごとにヘッダーやフッターを設定できます。ここでは TODO アイテムの入力フォームを表示するセクションと、TODO アイテムのリストを表示するセクションと、完了した TODO アイテムのリストを表示するセクションの 3 つのセクションが定義されています。

後者のセクションは `if !pendingTodos.isEmpty` と `if !completedTodos.isEmpty` で条件分岐されているため、TODO アイテムが存在しない場合には表示されないようになっています。

```swift:ContentView.swift
NavigationStack {
  List {
      Section {
          ...
      }

      if !pendingTodos.isEmpty {
          Section("TODO") {
            ...
          }
      }

      if !completedTodos.isEmpty {
          Section("Completed") {
            ...
          }
      }
  }
  .navigationTitle("TODOs")
}
```

### 入力フォームの表示

まずは入力フォームから見ていきましょう。`HStack` は横方向にビューを配置するためのコンポーネントです。`spacing: 12` は子ビュー同士のスペースを 12 ポイント空けることを意味しています。CSS のスタイルに例えると `display: flex; flex-direction: row; gap: 12px;` といった感じでしょうか。`TextField` と `Button` が横並びに配置されていることがわかります。

```swift:ContentView.swift
Section {
    HStack(spacing: 12) {
        TextField("New TODO", text: $newTodoTitle)
            .textInputAutocapitalization(.sentences)
            .submitLabel(.done)
            .onSubmit(addTodo)

        Button(action: addTodo) {
            Image(systemName: "plus.circle.fill")
                .imageScale(.large)
        }
        .buttonStyle(.borderless)
        .disabled(trimmedTitle.isEmpty)
        .accessibilityLabel("Add TODO")
    }
}
```

コンポーネントのスタイルを変更するためのモディファイアもいくつか使用されています。React コンポーネントの Props のようなものですが、モディファイアはビューを返す関数で、チェーンして呼び出すことができます。例えば、`Button` に対して `buttonStyle(.borderless)` を呼び出すことで、ボタンのスタイルを変更しています。`disabled(trimmedTitle.isEmpty)` は trimmedTitle（空白を除いた後のタイトル）が空の場合にボタンを無効化するためのモディファイアです。

`buttonStyle` には `.borderless` のように先頭に `.` をつけた形式でスタイルが指定されています。これは SwiftUI の省略記法で、文脈から型名が推論できる場合に、型名を省略して値だけを記述できます。ここでは `ButtonStyle` という型が推論されているため、`.borderless` と記述できます。省略せずに記述した場合は `buttonStyle(BorderlessButtonStyle())` となります。

`Button` のクロージャーとして `Image(systemName: "plus.circle.fill")` というコードが使用されています。これは SF Symbols という Apple が提供するアイコンセットからアイコンを表示するためのものです。`systemName` に指定した名前のアイコンが表示されます。SF Symbols には数千種類のアイコンが用意されており、iOS アプリ開発ではよく使用されます。このアイコンは丸い背景にプラスマークが入ったアイコンで、一般的に「追加」を意味するアイコンとして使用されます。`.imageScale(.large)` はアイコンのサイズを大きくするためのモディファイアです。使用可能なアイコンの一覧は [SF Symbols](https://developer.apple.com/sf-symbols/) から確認できます。

`Image(systemName: "plus.circle.fill")` は本来 `Button` コンポーネントの `label` 引数として渡されるべきですが、SwiftUI の trailing closure の機能を使用して、引数としてではなく、`Button` のクロージャの中でアイコンを定義しています。SwiftUI では、引数がクロージャである場合に、引数リストの外側にクロージャを記述できます。これにより、コードがより読みやすくなります。本来 `Button` は概念的に以下のようなインターフェースとなっています。

```swift
Button(
    action: () -> Void,
    label: () -> some View
)
```

素朴に書くと以下のようになります。

```swift
Button(action: addTodo, label: {
    Image(systemName: "plus.circle.fill")
        .imageScale(.large)
})
```

最後の引数 `label` はクロージャーであるため、SwiftUI の trailing closure の機能を使用して、引数リストの外側にクロージャを記述できるのです。以下のように書くことができます。

```swift
Button(action: addTodo) {
    Image(systemName: "plus.circle.fill")
        .imageScale(.large)
}
```

複数のクロージャーがある場合は、最初のクロージャのみ引数を省略できます。このパターンのコードは SwiftUI で非常によく見られるので、慣れておくと良いでしょう。

```swift
Section {
    // content
} header: {
    Text("TODO")
} footer: {
    Text("Footer")
}
```

引数の `action` はボタンがタップされたときに実行されるクロージャを指定するためのもので、ここでは `addTodo` という関数が指定されています。`addTodo` 関数は新しい TODO アイテムを追加するための関数で、テキストフィールドに入力されたタイトルを使用して新しい TODO アイテムを作成し、TODO アイテムのリストに追加しています。

```swift:ContentView.swift
private func addTodo() {
    let title = trimmedTitle

    guard !title.isEmpty else {
        return
    }

    todos.append(
        TodoItem(
            id: UUID(),
            title: title,
            isCompleted: false,
            createdAt: Date()
        )
    )
    newTodoTitle = ""
    saveTodos()
}
```

`trimmedTitle` はタイトルの前後の空白を除いた値を返す Computed Property です。Computed Property とは、値を保持するためのストレージを持たず、値を計算して返すプロパティのことです。

ここでは `trimmingCharacters(in: .whitespaces)` を使用して、タイトルの前後の空白を除去する新しい文字列を計算して返しています。

```swift:ContentView.swift
private var trimmedTitle: String {
    newTodoTitle.trimmingCharacters(in: .whitespacesAndNewlines)
}
```

### TODO アイテムのリストの表示

TODO アイテムのリストは `List` コンポーネントを使用して表示しています。`ForEach` はコレクションの各要素に対してビューを生成するためのコンポーネントで、React でいうところの `map` に近い概念です。`ForEach` の引数には、識別可能なコレクションを渡す必要があります。識別可能なコレクションとは、要素が一意に識別できるもので、`Identifiable` プロトコルに準拠している必要があります。

Computed Property `pendingTodos` を定義して、TODO アイテムのうち完了していないものだけをフィルタリング・ソートして返すようにしています。

```swift:ContentView.swift
if !pendingTodos.isEmpty {
    Section("TODO") {
        ForEach(pendingTodos) { todo in
            TodoRow(todo: todo)
                .contentShape(Rectangle())
                .onTapGesture {
                    toggleTodo(todo)
                }
                .swipeActions {
                    deleteButton(for: todo)
                }
        }
    }
}

private var pendingTodos: [TodoItem] {
    todos
        .filter { !$0.isCompleted }
        .sorted { $0.createdAt < $1.createdAt }
}
```

`.filter`, `.sorted` の関数内では `$0` と `$1` という特殊な変数が使用されています。これはクロージャーの引数を省略した場合に、Swift が自動的に提供する暗黙の引数です。引数を省略せずに書くと以下のようになります。

```swift
private var pendingTodos: [TodoItem] {
    todos
        .filter { todo in
            return !todo.isCompleted
        }
        .sorted { todo1, todo2 in
            return todo1.createdAt < todo2.createdAt
        }
}
```

それぞれの TODO アイテムは `TodoRow` というカスタムビューで表示しています。`contentShape(Rectangle())` はタップジェスチャーの有効範囲をビュー全体にするためのモディファイアです。これがないと、テキスト部分だけがタップ可能になってしまいます。`contentShape(Rectangle())` を使用することで、TODO アイテムの行全体の長方形領域がタップ可能になります。

`onTapGesture` はタップジェスチャーが発生したときに実行されるクロージャを指定します。ここでは `toggleTodo` 関数が指定されていて、TODO アイテムの完了状態を切り替えるための関数です。

```swift:ContentView.swift
private func toggleTodo(_ todo: TodoItem) {
    guard let index = todos.firstIndex(where: { $0.id == todo.id }) else {
        return
    }

    todos[index].isCompleted.toggle()
    saveTodos()
}
```

`swipeActions` はリストアイテムのスワイプ操作に対してアクションを定義します。ここでは左スワイプで削除アクションが表示されるようになっています。`deleteButton(for: todo)` は削除ボタンを生成するための関数で、`Button` コンポーネントを使用して削除アクションを定義しています。

`@ViewBuilder` は関数が複数のビューを返すことができるようにするための属性で、SwiftUI のビルダーパターンを使用してビューを構築するために必要になります。`@ViewBuilder` を使用しない普通の Swift の関数では分岐ごとに異なる型を返すのが難しい場合があります。ただし今回の `deleteButton` 関数のように、常に同じ型のビューを返す場合には `@ViewBuilder` を使用する必要はありませんが、View helper 関数を定義する際には `@ViewBuilder` を使用することが一般的です。

```swift:ContentView.swift
@ViewBuilder
private func deleteButton(for todo: TodoItem) -> some View {
    Button(role: .destructive) {
        deleteTodo(todo)
    } label: {
        Label("Delete", systemImage: "trash")
    }
}
```

Button の `role: .destructive` はこのボタンが破壊的なアクションを表すことを示しています。これにより、iOS はユーザーに対してこのアクションがデータを削除するなどの取り消せない操作であることを視覚的に伝えるためのスタイルを適用します。例えば、削除ボタンが赤色で表示されるようになります。Button の `role` を正しく指定することはアクセシビリティの観点からも重要で、スクリーンリーダーなどの支援技術がユーザーに対して適切な情報を提供できるようになります。

## アプリケーションのリファクタリング

ここまでのコードはすべて `ContentView` に実装されていて、コードの構造があまり良くない状態になっています。次はコードのリファクタリングを指示してみましょう。新しいセッションを開始して、以下のようなプロンプトを与えてみました。ユースケース [Refactor SwiftUI screens](https://developers.openai.com/codex/use-cases/ios-swiftui-view-refactor) を参考に、コードを複数のファイルに分割して、コードの構造を改善するためのプロンプトになっています。

```txt
Build iOS Apps プラグインとその SwiftUI ビュー リファクタリングスキルを使用して、画面の動作や外観を変更せずに ContentView.swift のコードをリファクタリングしてください。

Constraints:
- 別々に報告する必要のあるバグが見つからない限り、動作、レイアウト、ナビゲーション、およびビジネス ロジックを維持します。
- MVVM ではなく、MV をデフォルトとします。新しいビュー モデルを導入する前に、`@State`、`@Environment`、`@Query`、`.task`、`.task(id:)`、および `onChange` を優先し、この機能に明らかにビュー モデルが必要な場合にのみビュー モデルを保持します。
- 保存されたプロパティ、計算された状態、`init`、`body`、ビュー ヘルパー、およびヘルパー メソッドが上から下へ簡単にスキャンできるように、ビューの順序を変更します。
- 意味のあるセクションを、小さな明示的な入力、`@Binding`、およびコールバックを備えた専用の `View` 型に抽出します。1 つの巨大な `body` を、大量の大きな計算された `some View` プロパティで置き換えないでください。
- 複雑なボタン操作や副作用を `body` から小さなメソッドに移動し、実際のビジネスロジックをサービスまたはモデルに移動します。
- ルートビューツリーを安定させます。ローカライズされた条件セクションや修飾子で十分な場合は、まったく異なる画面を切り替えるトップレベルの `if/else` ブランチを避けます。
- リファクタリング中に Observation の所有権を修正します。iOS 17 以降では、ルートの `@Observable` モデルに `@State` を使用し、UI が本当にその状態形状を必要とする場合を除き、オプションまたは遅延初期化のビューモデルを避けます。
- 各抽出後、画面の動作が以前と同じであることを証明できる最小限の有用なビルドまたはテストチェックを実行します。

Deliver:
- リファクタリングされた画面と抽出されたサブビュー
- 新しいサブビューの境界とデータフローの簡単な説明
- ビューモデルを意図的に保持した場所とその理由
- 動作がそのまま維持されていることを証明するために実行した検証チェック
```

今回は `Views/`, `Models/`, `Services/` という 3 つのディレクトリを作成して、コードをそれぞれのディレクトリに分割することを提案してもらいました。リファクタリング後の構造は以下のようになっています。`Views/ContentView.swift` は画面全体の状態とアクションを持つだけのシンプルな構造になります。

```sh
StarterApp/
  StarterApp.swift

  Views/
    ContentView.swift
    TodoEntrySection.swift
    TodoListSection.swift
    TodoRow.swift

  Models/
    TodoItem.swift

  Services/
    TodoStorage.swift

  Assets.xcassets/
```

これは責務別にコードを分割する方法の一例ですが、機能別にコードを分割する方法もあります。このあたりの議論は React のコードをどのように分割するかという話でもよく出てくる話題ですね。機能別に分割する場合は以下のようになります。

```sh
StarterApp/
  App/
    StarterApp.swift

  Features/
    Todos/
      Views/
        ContentView.swift
        TodoEntrySection.swift
        TodoListSection.swift
        TodoRow.swift
      Models/
        TodoItem.swift
      Services/
        TodoStorage.swift

  Shared/
    Components/
    Services/
    Extensions/

  Resources/
    Assets.xcassets
```

リファクタリングが実行された後に、ビルドとシミュレータでの動作確認を行って、リファクタリング前と同じように動作することを確認しました。

## まとめ

- SwiftUI を使用して、TODO リストの機能を持つ iOS アプリケーションを実装した
- Codex 自身にフィードバックループを回してもらうために、`build-ios-apps` プラグインのスキルを使用して、アプリケーションのビルドとシミュレータでの動作確認を行った。アプリケーションの操作には `Computer Use` ツールを使用して、Codex が macOS 上の GUI を見て、クリックや入力、画面遷移を行えるようにした
- OpenAI が提供するユースケースのプロンプトを元にプロジェクトを構築したり、コードのリファクタリングを行ったりした
- コードの理解を深めるために、コードの各部分について質問して、SwiftUI のコードの構造や、Swift の言語機能について説明してもらった。説明を受ける際には、React に慣れ親しんでいるが iOS アプリ開発の経験はほとんどないという前提を伝えることで、React でいうところのどの部分に相当するのかといった説明を加えてもらった

## 参考

- [Native development – Codex | OpenAI Developers](https://developers.openai.com/codex/use-cases/collections/native-development)
- [Build for iOS | Codex use cases](https://developers.openai.com/codex/use-cases/native-ios-apps)
- [Refactor SwiftUI screens | Codex use cases](https://developers.openai.com/codex/use-cases/ios-swiftui-view-refactor)
- [Debug in iOS simulator | Codex use cases](https://developers.openai.com/codex/use-cases/ios-simulator-bug-debugging)
- [getsentry/XcodeBuildMCP: A Model Context Protocol (MCP) server and CLI that provides tools for agent use when working on iOS and macOS projects.](https://github.com/getsentry/XcodeBuildMCP)
