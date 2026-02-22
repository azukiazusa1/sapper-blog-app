import { describe, test, expect } from "vitest";
import { extractToc, isMatchPath, removeTrailingSlash } from "./utils";

describe("removeTrailingSlash", () => {
  test("末尾スラッシュを取り除く", () => {
    expect(removeTrailingSlash("/foo/bar/")).toEqual("/foo/bar");
  });

  test("末尾にスラッシュがないならそのまま", () => {
    expect(removeTrailingSlash("/foo/bar")).toEqual("/foo/bar");
  });
});

describe("isMatchPath", () => {
  test("現在のルートの1つ目の階層が一致していれば true を返す", () => {
    expect(isMatchPath("/foo/bar", "/foo/baz")).toBe(true);
    expect(isMatchPath("/foo", "/foo/bar")).toBe(true);
    expect(isMatchPath("/foo", "/foo")).toBe(true);
  });

  test("現在のルートの1つ目の階層が一致していなければ false を返す", () => {
    expect(isMatchPath("/foo/bar", "/bar/baz")).toBe(false);
    expect(isMatchPath("/foo", "/bar")).toBe(false);
  });
});

describe("extractToc", () => {
  test("h2〜h4 の見出しを抽出する", () => {
    const html = `
      <h2 id="section-1">セクション1</h2>
      <p>本文</p>
      <h3 id="section-1-1">セクション1-1</h3>
      <h4 id="section-1-1-1">セクション1-1-1</h4>
      <h2 id="section-2">セクション2</h2>
    `;
    expect(extractToc(html)).toEqual([
      { id: "section-1", text: "セクション1", level: 2 },
      { id: "section-1-1", text: "セクション1-1", level: 3 },
      { id: "section-1-1-1", text: "セクション1-1-1", level: 4 },
      { id: "section-2", text: "セクション2", level: 2 },
    ]);
  });

  test("h1 と h5 以降は抽出しない", () => {
    const html = `
      <h1 id="title">タイトル</h1>
      <h2 id="section">セクション</h2>
      <h5 id="deep">深い見出し</h5>
      <h6 id="deeper">もっと深い見出し</h6>
    `;
    expect(extractToc(html)).toEqual([
      { id: "section", text: "セクション", level: 2 },
    ]);
  });

  test("見出し内の HTML タグを除去してテキストだけ抽出する", () => {
    const html = `
      <h2 id="link-heading"><a href="#link-heading" class="icon-link">#</a>リンク付き見出し</h2>
      <h3 id="bold-heading"><strong>太字</strong>の見出し</h3>
    `;
    expect(extractToc(html)).toEqual([
      { id: "link-heading", text: "#リンク付き見出し", level: 2 },
      { id: "bold-heading", text: "太字の見出し", level: 3 },
    ]);
  });

  test("見出しがない場合は空配列を返す", () => {
    const html = `<p>本文のみ</p>`;
    expect(extractToc(html)).toEqual([]);
  });

  test("空文字の場合は空配列を返す", () => {
    expect(extractToc("")).toEqual([]);
  });

  test("id に日本語やハイフンが含まれる場合も正しく抽出する", () => {
    const html = `
      <h2 id="リンクカード">リンクカード</h2>
      <h3 id="my-long-section-name">長いセクション名</h3>
    `;
    expect(extractToc(html)).toEqual([
      { id: "リンクカード", text: "リンクカード", level: 2 },
      { id: "my-long-section-name", text: "長いセクション名", level: 3 },
    ]);
  });

  test("見出しに追加の属性がある場合も正しく抽出する", () => {
    const html = `<h2 id="section" class="heading" data-foo="bar">セクション</h2>`;
    expect(extractToc(html)).toEqual([
      { id: "section", text: "セクション", level: 2 },
    ]);
  });
});
