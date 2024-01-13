import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest";
import { remark } from "remark";
import markdown from "remark-parse";
import html from "remark-html";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import remarkLinkCard from "./index";

const server = setupServer(
  http.get("https://example.com", () => {
    return HttpResponse.text(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta property="og:title" content="Example Site" />
  <meta property="og:description" content="This is description" />
  <meta property="og:url" content="http://example.com" />
  <meta property="og:image" content="http://example.com" />
  <title>Example Site</title>
</head>
<body>
</body>
</html>
`);
  }),
  http.head("https://www.google.com/s2/favicons", () => {
    return new Response(null, { status: 200 });
  }),
);

beforeAll(() => {
  server.listen();
});
beforeEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

const processor = remark().use(markdown).use(remarkLinkCard).use(html);

describe("remark-link-card", () => {
  test("リンクのみの行が存在する場合、カードに変換する", async () => {
    const { value } = await processor.process(`
## test

[https://example.com](https://example.com)

`);
    expect(value.toString()).toBe(`<h2>test</h2>
<div><a href="https://example.com/" rel="noreferrer noopener" target="_blank"><div><div><div>Example Site</div><div>This is description</div></div><div><img src="https://www.google.com/s2/favicons?domain=example.com&#x26;sz=14" width="14" height="14" alt=""><span>example.com</span></div></div><div><img src="http://example.com/" alt=""></div></a></div>
`);
  });

  test("同じ行にリンクとテキストが存在する場合、カードに変換しない", async () => {
    const { value } = await processor.process(`
## test

[https://example.com](https://example.com) test
`);
    expect(value.toString()).toBe(`<h2>test</h2>
<p><a href="https://example.com">https://example.com</a> test</p>
`);
  });

  test("リンクのテキストと URL が異なる場合、カードに変換しない", async () => {
    const { value } = await processor.process(`
## test

[example](https://example.com)
`);

    expect(value.toString()).toBe(`<h2>test</h2>
<p><a href="https://example.com">example</a></p>
`);
  });

  test("ファビコン確認のリクエストに失敗した場合、ファビコンを表示しない", async () => {
    server.use(
      http.head("https://www.google.com/s2/favicons", () => {
        return new Response(null, { status: 404 });
      }),
    );
    const { value } = await processor.process(`
## test

[https://example.com](https://example.com)
`);
    expect(value.toString()).toBe(`<h2>test</h2>
<div><a href="https://example.com/" rel="noreferrer noopener" target="_blank"><div><div><div>Example Site</div><div>This is description</div></div><div><div></div><span>example.com</span></div></div><div><img src="http://example.com/" alt=""></div></a></div>
`);
  });

  test("画像の URL の形式が不正な場合、画像を表示しない", async () => {
    server.use(
      http.get("https://example.com", () => {
        return HttpResponse.text(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta property="og:title" content="Example Site" />
  <meta property="og:description" content="This is description" />
  <meta property="og:url" content="http://example.com" />
  <meta property="og:image" content="example.com" />
  <title>Example Site</title>
</head>
<body>
</body>
</html>
`);
      }),
    );
    const { value } = await processor.process(`
## test

[https://example.com](https://example.com)
`);

    expect(value.toString()).toBe(`<h2>test</h2>
<div><a href="https://example.com/" rel="noreferrer noopener" target="_blank"><div><div><div>Example Site</div><div>This is description</div></div><div><img src="https://www.google.com/s2/favicons?domain=example.com&#x26;sz=14" width="14" height="14" alt=""><span>example.com</span></div></div><div></div></a></div>
`);
  });

  test("title,description はサニタイズされる", async () => {
    server.use(
      http.get("https://example.com", () => {
        return HttpResponse.text(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta property="og:title" content="evil title<script>alert(1)</script>" />
  <meta property="og:description" content="evil description<script>alert(1)</script>" />
  <meta property="og:url" content="http://example.com" />
  <meta property="og:image" content="example.com" />
  <title>Example Site</title>
</head>
<body>
</body>
</html>
`);
      }),
    );
    const { value } = await processor.process(`
## test

[https://example.com](https://example.com)
`);
    expect(value.toString()).toBe(`<h2>test</h2>
<div><a href="https://example.com/" rel="noreferrer noopener" target="_blank"><div><div><div>evil title</div><div>evil description</div></div><div><img src="https://www.google.com/s2/favicons?domain=example.com&#x26;sz=14" width="14" height="14" alt=""><span>example.com</span></div></div><div></div></a></div>
`);
  });
});
