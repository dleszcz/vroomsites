import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const isDev = process.env.NODE_ENV === 'development';
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: isDev ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: 900,
          fontFamily: "system-ui, sans-serif",
          boxShadow: isDev ? '0 4px 10px rgba(239, 68, 68, 0.5)' : '0 4px 10px rgba(59, 130, 246, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {isDev ? 'DEV' : 'VS'}
      </div>
    ),
    { ...size }
  )
}
