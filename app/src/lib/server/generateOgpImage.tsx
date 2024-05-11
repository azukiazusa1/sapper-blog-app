import React from "react";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const fontCache = new Map<string, ArrayBuffer>();

async function getFontData(url: string) {
  const css = await (
    await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    })
  ).text();

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (!resource) return;

  return await fetch(resource[1]).then((res) => res.arrayBuffer());
}

const generateOgpImage = async (element: React.ReactNode) => {
  if (fontCache.size === 0) {
    const fontRegular = await getFontData(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap",
    );
    const fontBold = await getFontData(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap",
    );

    fontCache.set("regular", fontRegular);
    fontCache.set("bold", fontBold);
  }

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Noto Sans JP",
        data: fontCache.get("regular")!,
        style: "normal",
        weight: 400,
      },
      {
        name: "Noto Sans JP",
        data: fontCache.get("bold")!,
        style: "normal",
        weight: 600,
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const image = resvg.render();

  return image.asPng();
};

/**
 * ブログ記事向けのOGP画像を生成する
 */
export const generateBlogOgpImage = async (title: string, tags: string[]) => {
  return generateOgpImage(
    <div
      style={{
        display: "flex",
        padding: 48,
        height: "100%",
        backgroundImage: " linear-gradient(-60deg, #df89b5 0%, #bfd9fe 100%)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          backgroundColor: "white",
          color: "#000000d1",
          padding: 48,
          borderRadius: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: 64, maxWidth: 1000, fontWeight: 600 }}>
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
            {tags.map((tag, i) => (
              <div
                key={i}
                style={{
                  fontSize: 24,
                  fontWeight: 400,
                  border: "1px solid #d1d5db",
                  padding: "4px 24px",
                  borderRadius: 9999,
                  marginRight: 12,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 400,
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="https://avatars.githubusercontent.com/u/59350345?s=400&u=9248ba88eab0723c214e002bea66ca1079ef89d8&v=4"
              width={60}
              height={60}
              style={{ borderRadius: 9999, marginRight: 24 }}
            />
            azukiazusa
          </div>
        </div>
      </div>
    </div>,
  );
};

/**
 * ショート記事向けのOGP画像を生成する
 */
export const generateShortOgpImage = async (title: string) => {
  return generateOgpImage(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        color: "white",
        fontSize: 52,
        fontWeight: 600,
      }}
    >
      <div
        style={{
          padding: 24,
          textWrap: "balance",
        }}
      >
        {title}
      </div>
    </div>,
  );
};
