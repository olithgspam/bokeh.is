'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Camera {
  id: number;
  name: string;
  raw_size_min: number;
  raw_size_max: number;
}

interface VideoFormat {
  id: number;
  resolution: string;
  fps: number;
  codec: string;
  mbps: number;
}

const cardSizes = [16, 32, 64, 128, 256, 512, 1024, 2048];

export default function CameraCalculator() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [videoFormats, setVideoFormats] = useState<VideoFormat[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(null);
  const [cardSize, setCardSize] = useState(128);
  const [mode, setMode] = useState<'photo' | 'video' | 'both'>('photo');
  const [photoCount, setPhotoCount] = useState<number>(0);

  useEffect(() => {
    async function fetchCameras() {
      const { data } = await supabase.from('cameras').select('*');
      if (data) setCameras(data);
    }
    fetchCameras();
  }, []);

  useEffect(() => {
    async function fetchFormats() {
      if (selectedCamera) {
        const { data } = await supabase.from('video_formats').select('*').eq('camera_id', selectedCamera.id);
        setVideoFormats(data || []);
        setSelectedFormat(data ? data[0] : null);
      }
    }
    fetchFormats();
  }, [selectedCamera]);

  const cardMB = cardSize * 1024;
  
  // Reikna pláss sem myndir taka (notum meðaltal af RAW stærð)
  const avgPhotoSize = selectedCamera ? (selectedCamera.raw_size_min + selectedCamera.raw_size_max) / 2 : 0;
  const photosUsedMB = photoCount * avgPhotoSize;
  const remainingMB = Math.max(0, cardMB - photosUsedMB);

  return (
    <div className="glass-card">
      <h2>Gagnamagnsreiknivél</h2>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['photo', 'video', 'both'].map((m) => (
          <button 
            key={m}
            onClick={() => setMode(m as any)} 
            style={{ 
              flex: 1, padding: '0.8rem', 
              background: mode === m ? '#f59e0b' : '#333', 
              border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 'bold',
              textTransform: 'capitalize'
            }}
          >
            {m === 'photo' ? 'Myndir' : m === 'video' ? 'Vídeó' : 'Bæði'}
          </button>
        ))}
      </div>

      <div className="input-group">
        <label>Veldu Myndavél:</label>
        <select onChange={(e) => setSelectedCamera(cameras.find(c => c.id === Number(e.target.value)) || null)}>
          <option value="">-- Veldu vél --</option>
          {cameras.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {(mode === 'video' || mode === 'both') && selectedCamera && (
        <div className="input-group">
          <label>Vídeóstillingar:</label>
          <select onChange={(e) => setSelectedFormat(videoFormats.find(f => f.id === Number(e.target.value)) || null)}>
            {videoFormats.map(f => (
              <option key={f.id} value={f.id}>{f.resolution} - {f.fps}fps ({f.codec})</option>
            ))}
          </select>
        </div>
      )}

      {mode === 'both' && (
        <div className="input-group">
          <label>Fjöldi RAW mynda sem þú ætlar að taka:</label>
          <input 
            type="number" 
            value={photoCount} 
            onChange={(e) => setPhotoCount(Math.max(0, Number(e.target.value)))}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', border: '1px solid rgba(245,158,11,0.5)' }}
          />
        </div>
      )}

      <div className="input-group">
        <label>Stærð minniskorts:</label>
        <select value={cardSize} onChange={(e) => setCardSize(Number(e.target.value))}>
          {cardSizes.map(s => <option key={s} value={s}>{s >= 1024 ? `${s/1024}TB` : `${s}GB`}</option>)}
        </select>
      </div>

      {selectedCamera && (
        <div className="results-box">
          {mode === 'photo' ? (
            <div className="highlight-numbers">
              {Math.floor(cardMB / selectedCamera.raw_size_max).toLocaleString()} - {Math.floor(cardMB / selectedCamera.raw_size_min).toLocaleString()} myndir
            </div>
          ) : mode === 'video' ? (
            selectedFormat && (
              <div className="highlight-numbers">
                {Math.floor((cardMB / (selectedFormat.mbps * 60)))} mínútur
              </div>
            )
          ) : (
            selectedFormat && (
              <>
                <p>Eftir fyrir myndband:</p>
                <div className="highlight-numbers">
                  {Math.floor((remainingMB / (selectedFormat.mbps * 60)))} mínútur
                </div>
                <small style={{ color: '#aaa' }}>Miðað við að {photoCount} myndir taki um {(photosUsedMB / 1024).toFixed(1)} GB</small>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}