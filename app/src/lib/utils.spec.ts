import exp from "constants";
import { describe, test, expect } from "vitest";
import { isMatchPath, removeTrailingSlash } from "./utils";

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
