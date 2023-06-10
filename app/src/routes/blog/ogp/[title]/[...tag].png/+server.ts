import { generateOgpImage } from "$lib/server/generateOgpImage";
import type { RequestHandler } from "@sveltejs/kit";
export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
  const { title, tag = "" } = params;
  const tags = tag.split("/");
  // 本番ビルド時のみOGP画像を生成する
  const png =
    process.env.VERCEL_ENV === "production"
      ? await generateOgpImage(title, tags)
      : Buffer.from("");

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
