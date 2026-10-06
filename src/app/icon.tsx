import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: 900,
          fontFamily: "system-ui, sans-serif",
          boxShadow: '0 4px 10px rgba(59, 130, 246, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        VS
      </div>
    ),
    { ...size }
  )
}
