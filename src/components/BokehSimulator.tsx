'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Camera {
  id: number;
  name: string;
  crop_factor?: number;
}

interface Lens {
  id: number;
  name: string;
  focal_length: number;
  max_aperture: number;
}

export default function BokehSimulator() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [lenses, setLenses] = useState<Lens[]>([]);
  
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedLens, setSelectedLens] = useState<Lens | null>(null);
  
  const [aperture, setAperture] = useState<number>(2.8);
  const [distance, setDistance] = useState<number>(2); 
  
  const [fgIndex, setFgIndex] = useState<number>(1);
  const [bgIndex, setBgIndex] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      const { data: camData } = await supabase.from('cameras').select('*');
      const { data: lensData } = await supabase.from('lenses').select('*');
      
      if (camData) setCameras(camData);
      if (lensData) setLenses(lensData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedLens && aperture < selectedLens.max_aperture) {
      setAperture(selectedLens.max_aperture);
    }
  }, [selectedLens, aperture]);

  const focalLength = selectedLens?.focal_length || 50; 
  const cropFactor = selectedCamera?.crop_factor || 1.0; 
  
  const calculatedBlur = Math.max(0, (focalLength * focalLength) / (aperture * distance * 50));
  
  return (
    <div className="glass-card" style={{ marginTop: '2rem', background: 'rgba(15, 15, 15, 0.95)' }}>
      <h2>Pro Bokeh Hermir</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="input-group" style={{ flex: '1 1 200px' }}>
          <label>Myndavél (Body):</label>
          <select onChange={(e) => setSelectedCamera(cameras.find(c => c.id === Number(e.target.value)) || null)}>
            <option value="">-- Veldu Vél --</option>
            {cameras.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        
        <div className="input-group" style={{ flex: '1 1 200px' }}>
          <label>Linsa:</label>
          <select onChange={(e) => setSelectedLens(lenses.find(l => l.id === Number(e.target.value)) || null)}>
            <option value="">-- Veldu Linsu --</option>
            {lenses.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      </div>

      <div className="input-group" style={{ marginBottom: '1.5rem' }}>
        <label>Ljósop (f-stop): <strong>f/{aperture.toFixed(1)}</strong></label>
        <input 
          type="range" 
          min={selectedLens ? selectedLens.max_aperture : 1.2} 
          max="22" 
          step="0.1" 
          value={aperture} 
          onChange={(e) => setAperture(Number(e.target.value))} 
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
        {selectedLens && <small style={{color: '#888'}}>Takmarkað við f/{selectedLens.max_aperture} eða minna ljósop.</small>}
      </div>

      <div className="input-group" style={{ marginBottom: '2rem' }}>
        <label>Fjarlægð að módeli: <strong>{distance} metrar</strong></label>
        <input 
          type="range" 
          min="0.5" 
          max="15" 
          step="0.5" 
          value={distance} 
          onChange={(e) => setDistance(Number(e.target.value))} 
          style={{ width: '100%', marginTop: '0.5rem' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <label style={{ color: '#ccc', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Forgrunnur (Módel):</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map(num => (
              <button key={num} onClick={() => setFgIndex(num)} style={{ padding: '0.5rem 1rem', background: fgIndex === num ? '#f59e0b' : '#333', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{num}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ color: '#ccc', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Bakgrunnur (Umhverfi):</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map(num => (
              <button key={num} onClick={() => setBgIndex(num)} style={{ padding: '0.5rem 1rem', background: bgIndex === num ? '#f59e0b' : '#333', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>{num}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '500px', overflow: 'hidden', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.2)', background: '#000' }}>
        <div style={{ width: '100%', height: '100%', transform: `scale(${cropFactor})`, transition: 'transform 0.5s ease', transformOrigin: 'center center' }}>
          <img 
            src={`/bg/bakgrunnur${bgIndex}.jpg`} 
            alt="Bakgrunnur"
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover',
              filter: `blur(${calculatedBlur}px)`,
              transition: 'filter 0.3s ease',
              transform: 'scale(1.1)' 
            }} 
          />
          <img 
            src={`/fg/forgrunnur${fgIndex}.png`} 
            alt="Manneskja"
            style={{ 
              position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
              height: '90%', objectFit: 'contain', zIndex: 10
            }} 
          />
        </div>
      </div>
    </div>
  );
}