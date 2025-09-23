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

export const HeroSection: React.FC = () => {
  return (
    <HeroContainer>
      <ChessPatternOverlay />
      
      <FloatingOrb top="1rem" left="1rem" size="4rem" />
      <FloatingOrb bottom="1rem" right="25%" size="5rem" delay="2s" />
      
      <HeroContent>
        <TitleSection>
          <TitleIcon>
            <span style={{ color: 'white', fontSize: '20px' }}>♔</span>
          </TitleIcon>
          <TitleText>
            체스 마스터 면접전
          </TitleText>
        </TitleSection>
        
        <Description>
          전략적 사고로 면접을 정복하세요. <br />
          매 수마다 신중하게, 승리를 위해 계획하세요.
        </Description>
        
        <ButtonGroup>
          <Link href="/battle">
            <PrimaryButton size="lg">
              <span style={{ marginRight: '8px' }}>♞</span>
              배틀 시작
            </PrimaryButton>
          </Link>
          <Link href="/mock">
            <SecondaryButton size="lg">
              <span style={{ marginRight: '8px' }}>♗</span>
              단독 훈련
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
