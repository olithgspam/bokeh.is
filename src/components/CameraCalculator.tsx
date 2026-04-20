'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Camera {
  id: number;
  name: string;
  sensor_width: number;
  megapixels: number;
  raw_size_min: number;
  raw_size_max: number;
}

const cardSizesGB = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

export default function CameraCalculator() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedCard, setSelectedCard] = useState<number>(128);

  useEffect(() => {
    async function fetchCameras() {
      const { data, error } = await supabase.from('cameras').select('*');
      if (error) {
        console.error(error);
      } else {
        setCameras(data as Camera[]);
      }
    }
    fetchCameras();
  }, []);

  let minPhotos = 0;
  let maxPhotos = 0;

  if (selectedCamera) {
    const cardInMB = selectedCard * 1024;
    minPhotos = Math.floor(cardInMB / selectedCamera.raw_size_max);
    maxPhotos = Math.floor(cardInMB / selectedCamera.raw_size_min);
  }

  return (
    <div className="glass-card">
      <h2>Reikna Gagnamagn (RAW Myndir)</h2>
      
      <div className="input-group">
        <label>Veldu Myndavél:</label>
        <select 
          onChange={(e) => {
            const cam = cameras.find(c => c.id === Number(e.target.value));
            setSelectedCamera(cam || null);
          }}
        >
          <option value="">-- Engin valin --</option>
          {cameras.map(cam => (
            <option key={cam.id} value={cam.id}>{cam.name}</option>
          ))}
        </select>
      </div>

      {selectedCamera && (
        <>
          <div className="input-group">
            <label>Veldu Minniskort:</label>
            <select 
              value={selectedCard} 
              onChange={(e) => setSelectedCard(Number(e.target.value))}
            >
              {cardSizesGB.map(size => (
                <option key={size} value={size}>
                  {size >= 1024 ? `${size / 1024} TB` : `${size} GB`}
                </option>
              ))}
            </select>
          </div>

          <div className="results-box">
            <h3>Niðurstöður fyrir {selectedCamera.name}</h3>
            <p>Áætluð RAW skráarstærð: {selectedCamera.raw_size_min}MB - {selectedCamera.raw_size_max}MB</p>
            <p>Fjöldi mynda á {selectedCard >= 1024 ? `${selectedCard / 1024}TB` : `${selectedCard}GB`} kort:</p>
            <div className="highlight-numbers">
              {minPhotos.toLocaleString()} - {maxPhotos.toLocaleString()} myndir
            </div>
          </div>
        </>
      )}
    </div>
  );
}