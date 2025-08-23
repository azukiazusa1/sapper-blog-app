---
id: XEDNcZcHnpyhmd0sbUN5G
title: "Claude Code の学習モードで自分の手でコードを書く練習をしよう"
slug: "claude-code-learning-mode"
about: "コーディングに AI エージェントを活用する流れはもはや避けられないものとなっています。しかし、AI エージェントによってコーディングの多くが自動化されると、開発者が自分の手でコードを書く機会は減少してしまうというジレンマがあります。Claude Code の学習モードを使用すると、自分の手でコードを書く練習ができます。学習モードでは、AI エージェントはユーザー自身にも一部のコードの生成を依頼します。この記事では、Claude Code の学習モードの使い方について解説します。"
createdAt: "2025-08-23T13:01+09:00"
updatedAt: "2025-08-23T13:01+09:00"
tags: ["AI", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3HbASDkVChe9l3OtJh3j03/7a6aac529916499d9171140e55654c20/student-cap_17489-768x630.png"
  title: "学生帽のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude Code の学習モードを有効にするために使用するコマンドは何ですか？"
      answers:
        - text: "learning-mode コマンド"
          correct: false
          explanation: null
        - text: "output-style"
          correct: true
          explanation: "Claude Code の学習モードは output-style コマンドで Learning スタイルを選択することで有効になります。"
        - text: ".claude/settings.json 
          correct: false
          explanation: null
        - text: "CLAUDE.md"
          correct: false
          explanation: null
    - question: "ユーザーにコードの生成を依頼する箇所を示すために使用されるコメントは何ですか？"
      answers:
        - text: "// TODO(human)"
          correct: true
          explanation: "ユーザーにコードの生成を依頼する箇所は // TODO(human) というコメントで示されます。"
        - text: "// TODO(user)"
          correct: false
          explanation: null
        - text: "// WRITE_HERE"
          correct: false
          explanation: null
        - text: "// YOUR_TURN"
          correct: false
          explanation: null

published: true
---

コーディングに AI エージェントを活用する流れはもはや避けられないものとなっています。AI エージェントは人間よりも早い速度で大量のコードを生成でき、開発者の生産性を大幅に向上させる可能性を秘めています。その一方で AI が生成したコードを正しく理解し、コードベースのアーキテクチャに一貫したスタイルで書かれているか、セキュリティ上の問題がないかをレビューする開発者の能力は依然として重要です。

AI が生成したコードを理解し、レビューする能力は一朝一夕に身につくものではありません。このようなスキルを身につけるには自分の頭で考え、手を動かしてコードを書く経験が必要です。しかし、AI エージェントによってコーディングの多くが自動化されると、開発者が自分の手でコードを書く機会は減少してしまうというジレンマがあります。ビジネスの観点からはコードを書くスピードが求められているものの、開発者が学習の目的で自らの手でコードを書く時間を確保することもまた必要なことになってくるでしょう。

Claude Code の学習モードを使用すると、AI エージェントに頼らずに自分の手でコードを書く練習をできます。学習モードでは、AI エージェントはすべてのコードを生成するのではなく、ユーザー自身にも一部のコードの生成を依頼します。これにより、ユーザーは自分の手でコードを書く経験を積みながら、AI エージェントからのサポートも受けることができます。

この記事では、Claude Code の学習モードの使い方について解説します。

## Claude Code の学習モードを使う

Claude Code の学習モードは [output-style](https://docs.anthropic.com/en/docs/claude-code/output-styles) 機能を通じて利用できます。`output-style` は Claude Code がユーザーとコミュニケーションを取る際のスタイルをカスタマイズするための機能です。デフォルトではタスクを完了するために効率的にコード生成し、簡潔に回答するスタイルが使用されます。`output-style` デフォルトのスタイルに追加して以下の組み込みのスタイルが提供されています。

- `Explanatory`（説明型）: Claude が選択したコードの実装方針やコードパターンについて説明しながらコードを生成する
- `Learning`（学習型）: Claude がユーザーの学習をサポートするために、「インサイト」を共有したり、一部のコードの生成をユーザーに依頼する

Claude Code の学習モードは `Learning` スタイルを使用します。`output-style` を変更するためには Claude を起動した後に `/output-style` コマンドを実行します。

```bash
/output-style
```

スタイルを選択する UI が表示されるので、`Learning` スタイルを選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/1BydRYtbru1XKL8vrEcLzZ/02d8621c5c12383bd95e4838e93cf663/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-23_13.23.37.png)

スタイルを選択した後に Claude Code にタスクを指示してみましょう。ここでは例としてカンバンボードアプリケーションにおいて、表示中のタスクを文字列でフィルタリングする機能を実装するタスクを指示してみます。

```plaintext
カンバンボードにおいて、表示中のタスクを文字列でフィルタリングする機能を実装してください。
- ユーザーが入力フォームに入力した文字列に基づいて、表示中のタスクをリアルタイムでフィルタリングする
- タスクのタイトルにフィルタ文字列が含まれている場合にそのタスクを表示する
- 入力フォームはカンバンボードの上部に配置する
```

はじめはいつものスタイルと同じように、現在のカンバンボードのコードベースを調査して実装方針を計画します。

![](https://images.ctfassets.net/in6v9lxmm5c8/5yPPF57DBB0IeXkCPxgKA1/826f3811559614a948abbe374292767c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-23_13.27.33.png)

Claude Code が計画した実装方針は「インサイト」としてユーザーに共有されます。「インサイト」によりユーザーは Claude Code がどのような思考でコードを生成しようとしているのかを理解できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2A1Hcb2YUCvIvF6PSSl9uL/5f743f7bbba6bf3896f8941d22444b70/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-23_13.28.00.png)

フィルタ入力用のコンポーネントの作成は Claude Code がすべて作成しましたね。

![](https://images.ctfassets.net/in6v9lxmm5c8/2vnm3NY7vp4z7N6C0dJbCt/e6ae8f2a3928ce697a1eb1a85130aa12/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-23_13.38.06.png)

その後もフィルタリングロジックの中核部分は Claude Code により生成されていきました。フィルタリング機能の基本的な実装が完了した後、さらにユーザービリティを向上させるためのフィルタリングの状態を示す情報を追加しようとしています。この部分の実装をユーザーに依頼していますね。実装する箇所は `TODO(human)` というコメントで示されています。

```plaintext
● Learn by Doing

Context: フィルタリング機能の基本的な実装は完了しましたが、ユーザビリティを向上させるために、フィルタリングの状態を示す情報を追加したいと思います。現在のフィルタ結果で表示されているタスクの総数や、フィルタがアクティブな状態であることを明確に示すことで、ユーザーがより効果的にフィルタ機能を活用できます。

Your Task: /Users/xxx/sandbox/kanban-app/components/drag-drop-board.tsxのフィルター入力フィールドの下に、フィルタ結果の表示情報を追加してください。TODO(human)コメントの場所に実装してください。

Guidance: フィルタされたタスクの総数を表示し、フィルタがアクティブ（filterTextが空でない）な場合は「○件のタスクが見つかりました」のようなメッセージを表示してください。filteredBoardから各columnのtasks.lengthの合計を計算することができます。フィルタが無効な場合は何も表示しないか、全タスク数を表示するかを検討してください。
```

TODO リストの項目が「Request human input on filter result display implementation」となり、ユーザーの入力を待機する状態になっています。

![](https://images.ctfassets.net/in6v9lxmm5c8/4TMklXPpJleiOJH8ciDxsK/beb4c2963bc901660e020e88ed747ca2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-23_13.59.17.png)

ここではあえて誤ったコードを入力してみましょう。`filteredBoard.columns.reduce(...)` を使用すればフィルタされたタスクの総数を計算できますが、あえて `filteredBoard.columns.length` と誤ったコードを入力してみます。

```tsx {11-16}
 <div className="relative max-w-md">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="タスクをフィルタ..."
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
      className="pl-10"
    />
  </div>

  {filterText && (
    <p className="text-sm text-muted-foreground">
      {filteredBoard.columns.length}
      件のタスクが見つかりました
    </p>
  )}

  <DndContext
    sensors={sensors}
    onDragStart={handleDragStart}
    onDragOver={handleDragOver}
    onDragEnd={handleDragEnd}
  >
```

「実装が完了しました」と入力して送信します。「ただし、少し修正が必要ですね。現在のコードはカラム数を表示していますが、タスクの総数を表示する方が適切です。」修正が必要な箇所を指摘してくれました。

![](https://images.ctfassets.net/in6v9lxmm5c8/6f06awAxVR20AhV7P5ZJK4/fb343dae6607245868252e18bec0217f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-23_14.13.56.png)

これで実装が完了しました。個人的にはもう少しユーザーにコードの生成を依頼しても良いのではないかと考えますが、自分でコードを書くゆとりを与えてくれるのは良いところですね。

## まとめ

- Claude Code の `output-style` 機能を使用すると、エージェントの出力スタイルを変更できる
- デフォルトのスタイルは効率的にコードを生成し、簡潔に回答するスタイル。独自のスタイルを定義する他に、組み込みのスタイルとして `Explanatory` と `Learning` が提供されている
- Explanatory はコードの実装方法やコードパターンについて説明しながらコードを生成するスタイル
- Learning はユーザーの学習をサポートするために「インサイト」を共有したり、一部のコードの生成をユーザーに依頼するスタイル
- ユーザーにコードの生成を依頼する箇所を `// TODO(human)` というコメントで示し、ユーザーの入力を待機する状態に移行する

## 参考

- [Output styles - Anthropic](https://docs.anthropic.com/en/docs/claude-code/output-styles)