# CodePen Prefill の境界

## 共有できる内容

- ローカルのブラウザ環境で検証済みのコードだけを共有する
- CodePen を記事の技術的主張の検証根拠にしない
- API キー、トークン、Authorization ヘッダー、非公開 endpoint、個人情報、本番認証情報を含めない
- サーバー、Node.js、CLI、ビルド、複数プロセスが必要な例に使わない
- Pen を保存せず、公開範囲をユーザーの代わりに決めない

## パネルの契約

| パネル | 含める | 除外する |
| --- | --- | --- |
| HTML | `body` 内の要素 | doctype、`html`、`head`、`body`、`script`、`style` |
| CSS | CSS | `style` タグ |
| JavaScript | JavaScript | `script` タグ |

必要なパネルだけを使用し、ローカルで検証したコードを維持する。

## launcher と外部転送

スクリプトは CodePen Prefill payload を hidden field に持つローカル HTML フォームを作る。フォームを送信すると、公式 endpoint `https://codepen.io/pen/define` へコードが転送され、入力済みの未保存 Pen が開く。

launcher を開くことと、フォームを送信することを区別する。フォーム送信を外部転送の境界として扱い、直前に承認を得る。送信先は公式 endpoint に固定し、任意の URL へ変更できるようにしない。

公式情報:

- [Post to Prefill Pen](https://blog.codepen.io/docs/api/post-to-prefill-pen/)
- [CodePen API documentation](https://blog.codepen.io/docs/api/)
