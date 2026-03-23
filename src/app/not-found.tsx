import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
      padding: '2rem',
      background: 'var(--bg)',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-disp)',
        fontSize: 'clamp(80px, 15vw, 160px)',
        background: 'var(--gradient)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '0.05em',
      }}>
        404
      </h1>
      <p style={{ color: 'var(--grey-lt)', fontSize: '18px', marginBottom: '2rem' }}>
        This page doesn&apos;t exist.
      </p>
      <Link href="/" style={{
        color: 'var(--white)',
        border: '1px solid var(--border)',
        padding: '12px 28px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '14px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
      }}>
        Back to Home
      </Link>
    </div>
  )
}
