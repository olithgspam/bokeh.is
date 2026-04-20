'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Lens {
  id: number;
  name: string;
  max_aperture: number;
}

export default function BokehSimulator() {
  const [lenses, setLenses] = useState<Lens[]>([]);
  const [selectedAperture, setSelectedAperture] = useState(2.8);

  useEffect(() => {
    async function fetchLenses() {
      const { data } = await supabase.from('lenses').select('*');
      if (data) setLenses(data);
    }
    fetchLenses();
  }, []);

  const blurAmount = Math.max(0, (10 / selectedAperture));

  return (
    <div className="glass-card" style={{ marginTop: '2rem' }}>
      <h2>Bokeh Hermir</h2>
      
      <div className="input-group">
        <label>Veldu Ljósop (f-stop):</label>
        <select value={selectedAperture} onChange={(e) => setSelectedAperture(Number(e.target.value))}>
          <option value="1.4">f/1.4</option>
          <option value="2.8">f/2.8</option>
          <option value="4.0">f/4.0</option>
          <option value="8.0">f/8.0</option>
          <option value="16.0">f/16.0</option>
        </select>
      </div>

      <div className="preview-container" style={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden', borderRadius: '15px' }}>
        <img 
          src="/bakgrunnur.jpg" 
          alt="Bakgrunnur"
          style={{ 
            width: '100%', height: '100%', objectFit: 'cover',
            filter: `blur(${blurAmount}px)`,
            transition: 'filter 0.3s ease'
          }} 
        />
        <img 
          src="/forgrunnur.png" 
          alt="Manneskja"
          style={{ 
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            height: '100%', objectFit: 'contain'
          }} 
        />
      </div>
    </div>
  );
}