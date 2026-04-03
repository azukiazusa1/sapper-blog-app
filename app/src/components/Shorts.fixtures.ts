import type { ShortSource } from "$lib/shorts";

export const shortFixtures: ShortSource[] = [
  {
    sys: { id: "tailwind-data-attribute" },
    title: "Tailwind CSS の data 属性",
    createdAt: "2026-03-18T10:00:00.000Z",
    content1:
      "Tailwind CSS では data 属性に応じたスタイルを素直に書けます。UI の状態とスタイルを近い場所に置けるのが強みです。",
    content2:
      "たとえば `data-state=open` を持つ要素だけを装飾したいときは、属性セレクタ相当のユーティリティをそのままクラス名で表現できます。",
    content3:
      "ヘッドレス UI ライブラリは状態を data 属性で公開することが多いので、状態ごとの見た目を JavaScript なしで切り替えやすくなります。",
    content4:
      "アコーディオンやタブのように状態数が限られる UI では、data 属性ベースのスタイルは保守しやすい選択です。",
  },
  {
    sys: { id: "spec-driven-development" },
    title: "仕様駆動開発で先に決めるべきこと",
    createdAt: "2026-03-11T10:00:00.000Z",
    content1:
      "実装前に成功条件を言葉で固定すると、レビューの論点が機能要件に戻りやすくなります。",
    content2:
      "特に曖昧な UI 挙動は、正常系よりも『何をしないか』を先に決めておくと後戻りが減ります。",
    content3:
      "受け入れ条件を先に作ると、E2E と Storybook の粒度も決めやすくなります。",
    content4: "",
  },
];

export const shortThreadHtmlFixture = [
  "<p>Tailwind CSS では <code>data-*</code> 属性に応じたスタイルを素直に書けます。UI の状態とスタイルを近い場所に置けるのが強みです。</p>",
  "<p>たとえば <code>data-state=open</code> を持つ要素だけを装飾したいときは、属性セレクタ相当のユーティリティをそのままクラス名で表現できます。</p>",
  "<p>ヘッドレス UI ライブラリは状態を data 属性で公開することが多いので、状態ごとの見た目を JavaScript なしで切り替えやすくなります。</p>",
  "<p>アコーディオンやタブのように状態数が限られる UI では、data 属性ベースのスタイルは保守しやすい選択です。</p>",
];

export const shortListHtmlFixtures = shortFixtures.map((short) => ({
  ...short,
  htmlThreadItems:
    short.sys.id === "tailwind-data-attribute"
      ? shortThreadHtmlFixture
      : [
          "<p>実装前に成功条件を言葉で固定すると、レビューの論点が機能要件に戻りやすくなります。</p>",
          "<p>特に曖昧な UI 挙動は、正常系よりも「何をしないか」を先に決めておくと後戻りが減ります。</p>",
          "<p>受け入れ条件を先に作ると、E2E と Storybook の粒度も決めやすくなります。</p>",
        ],
}));
