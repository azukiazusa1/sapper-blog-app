import React from 'react'
import satori from 'satori'
import sharp from 'sharp'
import fs from 'fs'

export const generateOgpImage = async (title: string, tags: string[]) => {
  const font = fs.readFileSync('./fonts/NotoSansJP-Regular.otf')
  const svg = await satori(
    <div
      style={{
        display: 'flex',
        padding: 48,
        height: '100%',
        backgroundImage: ' linear-gradient(-60deg, #df89b5 0%, #bfd9fe 100%)',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          backgroundColor: 'white',
          fontWeight: 600,
          color: '#000000d1',
          padding: 48,
          borderRadius: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: 64, maxWidth: 1000 }}>{title}</div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
            {tags.map((tag, i) => (
              <div
                key={i}
                style={{
                  fontSize: 24,
                  backgroundColor: 'rgb(229,231,235)',
                  padding: '4px 24px',
                  borderRadius: 9999,
                  marginRight: 12,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 48, display: 'flex', alignItems: 'center' }}>
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
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: font,
          style: 'normal',
        },
      ],
    },
  )

  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  return png
}
