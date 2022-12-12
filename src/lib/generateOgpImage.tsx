import React from 'react'
import satori from 'satori'
import sharp from 'sharp'
import fs from 'fs'

export const generateOgpImage = async (title: string, tags: string[]) => {
  const font = fs.readFileSync('./fonts/NotoSansJP-Regular.otf')
  const svg = await satori(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'rgb(55,65,81)',
        fontWeight: 600,
        padding: 48,
        border: '48px solid rgb(31,41,55)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ color: '#fff', fontSize: 64, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
          {tags.map((tag, i) => (
            <div
              key={i}
              style={{
                color: '#fff',
                fontSize: 24,
                backgroundColor: 'rgb(107,114,128)',
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
        <div style={{ color: '#d1d5db', fontSize: 48, display: 'flex', alignItems: 'center' }}>
          <img
            src="https://avatars.githubusercontent.com/u/59350345?s=400&u=9248ba88eab0723c214e002bea66ca1079ef89d8&v=4"
            width={48}
            height={48}
            style={{ borderRadius: 9999, marginRight: 24 }}
          />
          azukiazusa
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
