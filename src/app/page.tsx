import Link from 'next/link';

export default function Home() {
  return (
    <main className="main-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0', color: '#fff' }}>Bokeh.is</h1>
        <p style={{ color: '#ccc', marginBottom: '3rem', fontSize: '1.2rem' }}>Fagleg verkfæri fyrir kvikmyndagerðarfólk og ljósmyndara.</p>
        
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          
          <Link href="/reiknivel" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '2rem', borderRadius: '15px', width: '250px', transition: 'transform 0.3s ease, background 0.3s ease, border-color 0.3s ease' }} className="menu-card">
              <h2 style={{ color: '#f59e0b', margin: '0 0 1rem 0' }}>Gagnamagn</h2>
              <p style={{ color: '#ddd', margin: 0 }}>Reiknaðu út gagnamagn og fjölda RAW mynda og lengdar á myndböndum fyrir mismunandi vélar og minniskort.</p>
            </div>
          </Link>

          <Link href="/bokeh" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '2rem', borderRadius: '15px', width: '250px', transition: 'transform 0.3s ease, background 0.3s ease, border-color 0.3s ease' }} className="menu-card">
              <h2 style={{ color: '#f59e0b', margin: '0 0 1rem 0' }}>Bokeh Hermir</h2>
              <p style={{ color: '#ddd', margin: 0 }}>Sjónrænn hermir til að sjá áhrif brennivíddar, ljósops og fjarlægðar á dýptarskerðingu.</p>
            </div>
          </Link>

        </div>
      </div>
    </main>
  );
}