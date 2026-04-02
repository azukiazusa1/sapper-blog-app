import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createBlogFile: vi.fn(),
  nanoid: vi.fn(),
  now: vi.fn(),
  log: vi.fn(),
}));

vi.mock("../fileOperation.ts", () => ({
  createBlogFile: mocks.createBlogFile,
}));

vi.mock("nanoid", () => ({
  nanoid: mocks.nanoid,
}));

vi.mock("../datetime.ts", () => ({
  now: mocks.now,
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  mocks.nanoid.mockReturnValue("new-id");
  mocks.now.mockReturnValue("2026-04-01T00:00+09:00");
  vi.spyOn(console, "log").mockImplementation(mocks.log);
});

describe("commands/new", () => {
  test("同じIDで日英2ファイルを生成する", async () => {
    await import("./new.ts");

    expect(mocks.createBlogFile).toHaveBeenNthCalledWith(1, {
      id: "new-id",
      title: undefined,
      slug: undefined,
      about: undefined,
      article: undefined,
      createdAt: "2026-04-01T00:00+09:00",
      updatedAt: "2026-04-01T00:00+09:00",
      tags: [],
      thumbnail: {
        url: "",
        title: "",
      },
      selfAssessment: {
        quizzes: [],
      },
      published: false,
    });
    expect(mocks.createBlogFile).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        id: "new-id",
      }),
      "en-GB",
    );
    expect(console.log).toHaveBeenCalledWith(
      "Created new blog post templates (ja/en): new-id",
    );
  });
});
