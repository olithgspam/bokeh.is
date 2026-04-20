import BokehSimulator from '@/components/BokehSimulator';
import Link from 'next/link';

export default function BokehPage() {
  return (
    <main className="main-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 'bold', marginBottom: '2rem', display: 'inline-block' }}>
          &larr; Til baka á forsíðu
        </Link>
        <BokehSimulator />
      </div>
    </main>
  );
}