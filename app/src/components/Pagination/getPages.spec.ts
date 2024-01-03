import { describe, test, expect } from "vitest";
import { getPages } from "./getPages";

describe("getPages", () => {
  test("合計ページが5ページ以下の場合は全て表示", () => {
    const pages = getPages({ page: 1, totalPage: 5 });

    expect(pages).toEqual([
      { value: 1, current: true, type: "page" },
      { value: 2, current: false, type: "page" },
      { value: 3, current: false, type: "page" },
      { value: 4, current: false, type: "page" },
      { value: 5, current: false, type: "page" },
    ]);
  });

  test("合計ページが6ページ以上かつ現在のページが1ページ目の場合、1 2 3 ... 最後のページを表示", () => {
    const pages = getPages({ page: 1, totalPage: 6 });

    expect(pages).toEqual([
      { value: 1, current: true, type: "page" },
      { value: 2, current: false, type: "page" },
      { value: 3, current: false, type: "page" },
      { type: "ellipsis" },
      { value: 6, current: false, type: "page" },
    ]);
  });

  test("合計ページが6ページ以上かつ現在のページが2ページ目の場合、1 2 3 4 ... 最後のページを表示", () => {
    const pages = getPages({ page: 2, totalPage: 6 });

    expect(pages).toEqual([
      { value: 1, current: false, type: "page" },
      { value: 2, current: true, type: "page" },
      { value: 3, current: false, type: "page" },
      { value: 4, current: false, type: "page" },
      { type: "ellipsis" },
      { value: 6, current: false, type: "page" },
    ]);
  });

  test("合計ページが6ページ以上かつ現在のページが3ページ目の場合、1 2 3 4 ... 6 を表示", () => {
    const pages = getPages({ page: 3, totalPage: 6 });

    expect(pages).toEqual([
      { value: 1, current: false, type: "page" },
      { value: 2, current: false, type: "page" },
      { value: 3, current: true, type: "page" },
      { value: 4, current: false, type: "page" },
      { type: "ellipsis" },
      { value: 6, current: false, type: "page" },
    ]);
  });

  test("合計ページが6ページ以上かつ現在のページが4ページ目の場合、1 ... 2 4 5 6 を表示", () => {
    const pages = getPages({ page: 4, totalPage: 6 });

    expect(pages).toEqual([
      { value: 1, current: false, type: "page" },
      { type: "ellipsis" },
      { value: 3, current: false, type: "page" },
      { value: 4, current: true, type: "page" },
      { value: 5, current: false, type: "page" },
      { value: 6, current: false, type: "page" },
    ]);
  });

  test("合計ページが6ページ以上かつ現在のページが5ページ目の場合、1 ... 4 5 6 を表示", () => {
    const pages = getPages({ page: 5, totalPage: 6 });

    expect(pages).toEqual([
      { value: 1, current: false, type: "page" },
      { type: "ellipsis" },
      { value: 4, current: false, type: "page" },
      { value: 5, current: true, type: "page" },
      { value: 6, current: false, type: "page" },
    ]);
  });

  test("合計ページが6ページ以上かつ現在のページが6ページ目の場合、1 ... 4 5 6 を表示", () => {
    const pages = getPages({ page: 6, totalPage: 6 });

    expect(pages).toEqual([
      { value: 1, current: false, type: "page" },
      { type: "ellipsis" },
      { value: 4, current: false, type: "page" },
      { value: 5, current: false, type: "page" },
      { value: 6, current: true, type: "page" },
    ]);
  });

  test("合計ページが10ページかつ現在のページが5ページ目の場合、1 ... 4 5 6 ... 最後のページを表示", () => {
    const pages = getPages({ page: 5, totalPage: 10 });

    expect(pages).toEqual([
      { value: 1, current: false, type: "page" },
      { type: "ellipsis" },
      { value: 4, current: false, type: "page" },
      { value: 5, current: true, type: "page" },
      { value: 6, current: false, type: "page" },
      { type: "ellipsis" },
      { value: 10, current: false, type: "page" },
    ]);
  });
});
