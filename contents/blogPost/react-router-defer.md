---
id: 3ISkqiVnVtrabiA8pnitOJ
title: "React Router の defer で重要なデータを先に描画する"
slug: "react-router-defer"
about: "あるページの中で重要ではない付随的なデータの取得を待たずに、重要なデータの取得が完了したタイミングでページを表示させたい場合があります。例えば、ブログの記事のページを遷移する場合、ユーザーにとって記事のコンテンツは重要なデータですが、それに付随するコメントやいいねの数はそれほど重要ではないので、それらのデータの取得を待つ必要がありません。  この記事では React Router の loaderを使用して重要なデータの完了のみを待機する方法を試してみます。"
createdAt: "2022-11-12T00:00+09:00"
updatedAt: "2022-11-12T00:00+09:00"
tags: ["React"]
published: true
---
あるページの中で重要ではない付随的なデータの取得を待たずに、重要なデータの取得が完了したタイミングでページを表示させたい場合があります。例えば、ブログの記事のページを遷移する場合、ユーザーにとって記事のコンテンツは重要なデータですが、それに付随するコメントやいいねの数はそれほど重要ではないので、それらのデータの取得を待つ必要がありません。

この記事では React Router の [loader](https://reactrouter.com/en/main/route/loader) を使用して重要なデータの完了のみを待機する方法を試してみます。

## 通常通り loader を使用する場合

まずは特別なことを考えずに通常通り `loader` を使用してデータの取得してみましょう。以下のように `<Article>` コンポーネントを作成します。

```tsx
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { Article, fetchArticle, fetchComments, Comment } from "../api";

export const loader: LoaderFunction = async ({ params: { articleId } }) => {
  if (!articleId) {
    throw new Error("No id provided");
  }

  const [article, comments] = await Promise.all([
    fetchArticle(articleId),
    fetchComments(articleId),
  ]);

  return {
    article,
    comments,
  };
};

type LoaderData = {
  article: Article;
  comments: Comment[];
};

export const ArticlePage: React.FC = () => {
  const { article } = useLoaderData() as LoaderData;

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
      <Comments />
    </div>
  );
};

const Comments: React.FC = () => {
  const { comments } = useLoaderData() as LoaderData;

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>{comment.body}</li>
      ))}
    </ul>
  );
};
```

はじめに `loader` 関数を定義して export しています。`loader` 関数は各ルートがレンダリングされる前に呼び出され、`return` したデータはルートのコンポーネント内で `useLoaderData@ フックから利用できます。つまり、`loader` 関数によりレンダリングが開始する間に API をコールでき、データの取得が完了したタイミングでレンダリングを開始できるようになります。

ここでは `fetchArticle` 関数と `fetchComments` 関数で API をコールしており、それぞれの関数が解決するまで `await` で待機してからレンダリングを開始することになります。`fetchArticle` 関数と `fetchCoomments` 関数はそれぞれ擬似的にデータの取得が完了するまで1秒と3秒かかるように設定しています。

それでは実際に試して確認してみましょう。`loader` 関数により `fetchArticle` と `fetchComments` のそれぞれの解決を待つ必要があるので、リンクをクリックしてからページ遷移が完了するまで3秒かかります。

![fetc-article-1](//images.ctfassets.net/in6v9lxmm5c8/5sDP3aXcreRyZKy7zc3iVJ/8d06daed8e2742d4d75d0bf8d1249a40/fetc-article-1.gif)

流れを図で表すと以下のようになります。

![スクリーンショット 2022-11-12 14.37.34](//images.ctfassets.net/in6v9lxmm5c8/2cGW6Q7WXqqhVn69YpuxtF/2ada14279404b23feda749c8873088b3/____________________________2022-11-12_14.37.34.png)

本来記事のコンテンツを取得するまで1秒しかかからないのですが、コメントの取得の完了まで待たなければいけないのでユーザーは3秒待たなければ記事のコンテンツを閲覧することができません。冒頭で述べたとおり、付随的なデータであるはずのコメントのせいでユーザーが余分な時間待機しなければ行けないのは不合理です。次はコメントデータの取得を待たないで済むように修正してみましょう。

## コンポーネント内でコメントデータを取得する

前回は `loader` 関数内で `fetchComments` の完了を待たなければいけないために全体的なページの表示に時間がかかってしまっているのでした。まずは `loader` 関数内で `fetchComments` を呼び出さないようにしてみましょう。

```diff
  export const loader: LoaderFunction = async ({ params: { articleId } }) => {
    if (!articleId) {
      throw new Error("No id provided");
    }

-   const [article, comments] = await Promise.all([
-     fetchArticle(articleId),
-     fetchComments(articleId),
-   ]);
-
-   return {
-     article,
-     comments,
-   };

+   return {
+     article: await fetchArticle(articleId),
+   };
  };

  type LoaderData = {
    article: Article;
-   comments: Comment[];
  };
```

`loader` 関数でコメントの取得をしなくなった代わりにどこか別の方法でコメントを取得する必要があります。ここでは使い古されたパターンを利用しましょう。`<Comments />`コンポーネントの `useEffect` でデータを取得します。

```tsx
const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const params = useParams();

  useEffect(() => {
    if (!params.articleId) {
      return;
    }
    fetchComments(params.articleId).then((comments) => setComments(comments));
  }, [params.articleId]);

  return (
    <>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.body}</li>
          ))}
        </ul>
      ) : (
        <p>Loading Comments...</p>
      )}
    </>
  );
};
```

それでは試してみましょう。目論見通り、1秒経過したタイミングで記事のコンテンツが表示されていることがわかります。記事のコンテンツが表示されたタイミングではコメントの取得は完了していないので「Loading Comments...」と表示されます。

![fetc-article-2](//images.ctfassets.net/in6v9lxmm5c8/EzLOvr2Mbq6FOwNQV3IRs/bfb709afe7e7f4629cd970a0d109fbd5/fetc-article-2.gif)

図で表すと以下のとおりです。

![スクリーンショット 2022-11-12 15.04.39](//images.ctfassets.net/in6v9lxmm5c8/HyQ3r3aOuG8OqjehcHdql/8608a2933a67e6c550aa26278bb8100d/____________________________2022-11-12_15.04.39.png)

この方法はうまくいっているように思えますが、1つ問題が生じています。それはコメントの取得は `<ArticlePage />` コンポーネントがレンダリングされた後でないと始まらないことです。つまり、ユーザーはページ遷移を開始してから4秒待たなければコメントを閲覧できないということになります。これは `useEffetc` が発火するのはコンポーネントがマウントされるタイミングであることに起因しています。`loader` 関数内でコメントを取得していたときには、コンポーネントの外でデータの取得をしていたため早いタイミングからデータの取得を開始できていたのですが、`<Comments>` コンポーネント内の `useEffet` でデータを取得するようになったために、記事の取得が完了しないとコメントのデータの取得を開始できなくなってしまいました。

これは [Fetch-on-Render](https://17.reactjs.org/docs/concurrent-mode-suspense.html#approach-1-fetch-on-render-not-using-suspense) と呼ばれるアプローチで、データの取得を開始するまでの他のデータの取得の完了を待たなければいけない状態はしばしば「waterfall」という問題となっています。

## `defer` レスポンスを返す

それでは最後に「waterfall」の問題を解決してみましょう。そのために `loader` 関数内で [defer](https://reactrouter.com/en/main/utils/defer) レスポンスを返すように修正します。

```tsx
export const loader: LoaderFunction = async ({ params: { articleId } }) => {
  if (!articleId) {
    throw new Error("No id provided");
  }
  return defer({
    comments: fetchComments(articleId),
    article: await fetchArticle(articleId),
  });
};

type LoaderData = {
  article: Article;
  comments: Promise<Comment[]>;
};
```

`defer` 関数は、解決された値の代わりにプロミスを渡すことで、`loader` から返される値を遅延させることができます。ここで注目すべき点は、`fetchArticle` 関数には `await` キーワードを付与しているけれど、`fetchComments` 関数には `await` キーワードを付与していない点です。React Router により `await` キーワードを付与するかどうかで自動的に遅延させるかどうか決定させることができます。

遅延したデータを利用するには React Router の提供する [`<Await>`](https://reactrouter.com/en/main/components/await) コンポーネントを利用します。遅延された値は `resolve` Props としてコンポーネントに渡します。`<Await>` コンポーネントの `children` は関数となっており、Promise が解決した時その値が引数として渡されます。Promise が reject された場合には `errorElement` Props の内容を描画します。

また、`<Await>` コンポーネントは Promise が解決されていない場合には Promise を throw するように設計されています。つまり、`<Suspense>` コンポーネントで囲って使用できるということです。

 ```tsx
 const Comments: React.FC = () => {
  const { comments } = useLoaderData() as LoaderData;

  return (
    <Suspense fallback={<p>Loading Comments...</p>}>
      <Await resolve={comments} errorElement={<p>Failed to load comments.</p>}>
        {(comments: Comment[]) => (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>{comment.body}</li>
            ))}
          </ul>
        )}
      </Await>
    </Suspense>
  );
}; 
```

それでは実際に試してみましょう。コメントのデータの取得は `loader` 関数で行われることになったため、取得を開始するまで記事の取得を待つ必要はありません。

![fetc-article-3](//images.ctfassets.net/in6v9lxmm5c8/2sXd53VkNiwrj7L9bfclTS/a188e8acad593856aa06e1b88beb102b/fetc-article-3.gif)

図で表すと以下のとおりです。

![スクリーンショット 2022-11-12 15.53.16](//images.ctfassets.net/in6v9lxmm5c8/3OrcJRDCeOon8l6xmhnsOt/5c082175fdf466f1ddb0c49877a89307/____________________________2022-11-12_15.53.16.png)
