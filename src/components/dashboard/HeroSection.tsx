import React from 'react';
import Link from 'next/link';
import {
  HeroContainer,
  ChessPatternOverlay,
  FloatingOrb,
  HeroContent,
  TitleSection,
  TitleIcon,
  TitleText,
  Description,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
  ChessBoardPreview,
  ChessGrid,
  ChessSquare,
  ChessPiece,
  AnimatedBorder
} from '../styled/HeroSection.styled';
import { APP_TEXTS } from '../../constants/texts';

export const HeroSection: React.FC = () => {
  return (
    <HeroContainer>
      <ChessPatternOverlay />
      
      <FloatingOrb $top="1rem" $left="1rem" $size="4rem" />
      <FloatingOrb $bottom="1rem" $right="25%" $size="5rem" $delay="2s" />
      
      <HeroContent>
        <TitleSection>
          <TitleIcon>
            <span style={{ color: 'white', fontSize: '20px' }}>♔</span>
          </TitleIcon>
          <TitleText>
            {APP_TEXTS.dashboard.hero.title}
          </TitleText>
        </TitleSection>
        
        <Description>
          {APP_TEXTS.dashboard.hero.subtitle}
        </Description>
        
        <ButtonGroup>
          <Link href="/battle">
            <PrimaryButton size="lg">
              <span style={{ marginRight: '8px' }}>♞</span>
              {APP_TEXTS.dashboard.hero.startButton}
            </PrimaryButton>
          </Link>
          <Link href="/mock">
            <SecondaryButton size="lg">
              <span style={{ marginRight: '8px' }}>♗</span>
              {APP_TEXTS.dashboard.actions.soloTraining.title}
            </SecondaryButton>
          </Link>
        </ButtonGroup>
      </HeroContent>
      
      <ChessBoardPreview>
        <ChessGrid>
          {Array.from({length: 64}).map((_, i) => (
            <ChessSquare 
              key={i} 
              $isDark={(Math.floor(i/8) + i) % 2 === 0}
            >
              {i === 0 && <ChessPiece $color="#3b82f6">♜</ChessPiece>}
              {i === 7 && <ChessPiece $color="#374151">♖</ChessPiece>}
              {i === 56 && <ChessPiece $color="#3b82f6">♔</ChessPiece>}
              {i === 63 && <ChessPiece $color="#374151">♚</ChessPiece>}
            </ChessSquare>
          ))}
        </ChessGrid>
      </ChessBoardPreview>

      <AnimatedBorder />
    </HeroContainer>
  );
};
