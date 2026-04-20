import CameraCalculator from '@/components/CameraCalculator';
import Link from 'next/link';

export default function ReiknivelPage() {
  return (
    <main className="calc-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 'bold', marginBottom: '2rem', display: 'inline-block' }}>
          &larr; Til baka á forsíðu
        </Link>
        <CameraCalculator />
      </div>
    </main>
  );
}