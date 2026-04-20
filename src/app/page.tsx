import CameraCalculator from '@/components/CameraCalculator';
import BokehSimulator from '@/components/BokehSimulator';

export default function Home() {
  return (
    <main className="main-bg">
      <h1 style={{ fontSize: '3rem', margin: '0' }}>Bokeh.is</h1>
      <p style={{ color: '#ccc', marginBottom: '2rem' }}>Gagnamagns- og bokeh hermir.</p>
      
      <CameraCalculator />
      <BokehSimulator />
    </main>
  );
}