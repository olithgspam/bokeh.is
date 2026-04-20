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

const cardSizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

export default function CameraCalculator() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [videoFormats, setVideoFormats] = useState<VideoFormat[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(null);
  
  const [cardSize, setCardSize] = useState(128);
  const [mode, setMode] = useState<'photo' | 'video' | 'both'>('photo');
  
  // Nýtt State fyrir Toggle rofann inni í Vídeó
  const [videoCalcMode, setVideoCalcMode] = useState<'cardToTime' | 'timeToCard'>('cardToTime');
  
  const [photoCount, setPhotoCount] = useState<number | ''>('');
  const [targetHours, setTargetHours] = useState<number | ''>('');
  const [targetMins, setTargetMins] = useState<number | ''>('');

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
        setSelectedFormat(data && data.length > 0 ? data[0] : null);
      }
    }
    fetchFormats();
  }, [selectedCamera]);

  const cardMB = cardSize * 1024;
  const pCount = Number(photoCount) || 0;
  const tHours = Number(targetHours) || 0;
  const tMins = Number(targetMins) || 0;
  
  const avgPhotoSize = selectedCamera ? (selectedCamera.raw_size_min + selectedCamera.raw_size_max) / 2 : 0;
  const photosUsedMB = pCount * avgPhotoSize;
  const remainingMB = Math.max(0, cardMB - photosUsedMB);

  const formatTime = (totalMinutes: number) => {
    if (totalMinutes < 60) return `${totalMinutes} mínútur`;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h} klst og ${m} mín`;
  };

  return (
    <div className="glass-card">
      <h2>Gagnamagnsreiknivél</h2>
      
      {/* MAIN TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { id: 'photo', label: 'Myndir' },
          { id: 'video', label: 'Vídeó' },
          { id: 'both', label: 'Bæði' }
        ].map((m) => (
          <button 
            key={m.id}
            onClick={() => setMode(m.id as any)} 
            style={{ 
              flex: '1 1 30%', padding: '0.8rem', 
              background: mode === m.id ? '#f59e0b' : '#333', 
              border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            {m.label}
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

      {/* TOGGLE SWITCH FYRIR VÍDEÓ */}
      {mode === 'video' && selectedCamera && selectedFormat && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '12px' }}>
          <button 
            onClick={() => setVideoCalcMode('cardToTime')}
            style={{ flex: 1, padding: '0.6rem', background: videoCalcMode === 'cardToTime' ? '#444' : 'transparent', color: videoCalcMode === 'cardToTime' ? '#f59e0b' : '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
          >
            Reikna Tíma úr Korti
          </button>
          <button 
            onClick={() => setVideoCalcMode('timeToCard')}
            style={{ flex: 1, padding: '0.6rem', background: videoCalcMode === 'timeToCard' ? '#444' : 'transparent', color: videoCalcMode === 'timeToCard' ? '#f59e0b' : '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
          >
            Reikna GB úr Tíma
          </button>
        </div>
      )}

      {mode === 'both' && (
        <div className="input-group">
          <label>Fjöldi RAW mynda tekinn (til að draga frá):</label>
          <input 
            type="number" 
            value={photoCount} 
            onChange={(e) => setPhotoCount(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
      )}

      {/* INPUTS BYGGT Á MODE OG SWITCH */}
      {mode === 'video' && videoCalcMode === 'timeToCard' ? (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label>Klukkustundir:</label>
            <input type="number" value={targetHours} onChange={(e) => setTargetHours(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label>Mínútur:</label>
            <input type="number" value={targetMins} onChange={(e) => setTargetMins(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
        </div>
      ) : (
        <div className="input-group">
          <label>Stærð minniskorts:</label>
          <select value={cardSize} onChange={(e) => setCardSize(Number(e.target.value))}>
            {cardSizes.map(s => <option key={s} value={s}>{s >= 1024 ? `${s/1024} TB` : `${s} GB`}</option>)}
          </select>
        </div>
      )}

      {selectedCamera && (
        <div className="results-box">
          {mode === 'photo' ? (
            <>
              <p>Áætlaður fjöldi RAW mynda á korti:</p>
              <div className="highlight-numbers">
                {Math.floor(cardMB / selectedCamera.raw_size_max).toLocaleString()} - {Math.floor(cardMB / selectedCamera.raw_size_min).toLocaleString()}
              </div>
            </>
          ) : mode === 'video' ? (
            selectedFormat && videoCalcMode === 'cardToTime' ? (
              <>
                <p>Áætlaður upptökutími á {cardSize >= 1024 ? `${cardSize/1024}TB` : `${cardSize}GB`} kort:</p>
                <div className="highlight-numbers">
                  {formatTime(Math.floor(cardMB / (selectedFormat.mbps * 60)))}
                </div>
              </>
            ) : selectedFormat && videoCalcMode === 'timeToCard' ? (
              <>
                <p>Áætlað pláss fyrir {tHours}h og {tMins}m:</p>
                <div className="highlight-numbers">
                  {(((tHours * 3600) + (tMins * 60)) * selectedFormat.mbps / 1024).toFixed(1)} GB
                </div>
                <small style={{ color: '#aaa' }}>Gagnahraði: {selectedFormat.mbps} MB/s</small>
              </>
            ) : null
          ) : (
            selectedFormat && (
              <>
                <p>Pláss eftir fyrir myndband:</p>
                <div className="highlight-numbers">
                  {formatTime(Math.floor(remainingMB / (selectedFormat.mbps * 60)))}
                </div>
                <small style={{ color: '#aaa' }}>Þú hefur notað {(photosUsedMB / 1024).toFixed(1)} GB í ljósmyndir</small>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}