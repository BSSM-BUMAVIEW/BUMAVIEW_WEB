import { useState, useEffect } from 'react';
import type { Particle } from '../types';
import { createParticles } from '../lib/utils';
import { UI_CONFIG } from '../constants';

export const useParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = createParticles(UI_CONFIG.particleCount);
    setParticles(newParticles);
  }, []);

  return particles;
};
