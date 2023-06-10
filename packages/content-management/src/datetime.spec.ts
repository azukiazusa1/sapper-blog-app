import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { now } from "./datetime.ts";

describe("datetime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  describe("now", () => {
    test("2021-3-4T00:00+09:00 の形式で現在時刻を返す", () => {
      vi.setSystemTime(new Date(2021, 3, 3, 0, 0, 0, 0));
      expect(now()).toBe("2021-04-03T00:00+09:00");
    });
  });
});
