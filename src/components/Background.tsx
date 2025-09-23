import React from 'react';
import { useParticles } from '../hooks/useParticles';
import { CHESS_PIECES } from '../constants';
import {
  BackgroundContainer,
  ChessPatternOverlay,
  Particle,
  GradientOverlay,
  AmbientOrb
} from './styled/Background.styled';

export const Background: React.FC = () => {
  const particles = useParticles();

  return (
    <BackgroundContainer>
      <ChessPatternOverlay />
      
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          x={particle.x}
          y={particle.y}
        >
          {CHESS_PIECES[particle.id % CHESS_PIECES.length]}
        </Particle>
      ))}
      
      <GradientOverlay />

      <AmbientOrb
        top="5rem"
        left="2.5rem"
        size="6rem"
        color="rgba(59, 130, 246, 0.1)"
      />
      <AmbientOrb
        bottom="5rem"
        right="5rem"
        size="8rem"
        color="rgba(139, 92, 246, 0.1)"
        delay="2s"
      />
    </BackgroundContainer>
  );
};
