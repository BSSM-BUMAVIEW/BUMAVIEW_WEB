import React from 'react';
import { Button } from './ui/button';
import { Crown, Users, Search, Trophy, Target, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavigationProps } from '../types';
import { NAVIGATION_ITEMS } from '../constants';
import {
  HeaderContainer,
  HeaderContent,
  LogoSection,
  LogoIcon,
  LogoText,
  Navigation,
  NavButton,
  AuthSection,
  UserInfo,
  UserAvatar,
  UserDetails,
  EloBadge,
  MobileMenuButton
} from './styled/Header.styled';

export function Header({ activeSection, onNavigate, isLoggedIn, onLogin, onLogout }: NavigationProps) {
  const pathname = usePathname();
  
  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: Crown, href: '/dashboard' },
    { id: 'battle', label: '면접 배틀', icon: Users, href: '/battle' },
    { id: 'search', label: '전략 탐색', icon: Search, href: '/search' },
    { id: 'rankings', label: '마스터 랭킹', icon: Trophy, href: '/rankings' },
    { id: 'mock', label: '단독 훈련', icon: Target, href: '/mock' },
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoSection>
          <LogoIcon>
            <Crown size={28} color="white" />
          </LogoIcon>
          <LogoText>
            <h1>부마뷰</h1>
            <p>Bumaview</p>
          </LogoText>
        </LogoSection>

        <Navigation>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.id} href={item.href}>
                <NavButton variant="ghost" size="sm" $isActive={isActive}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavButton>
              </Link>
            );
          })}
        </Navigation>

        <AuthSection>
          {isLoggedIn ? (
            <>
              <UserInfo>
                <UserAvatar>
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>♛</span>
                </UserAvatar>
                <UserDetails>
                  <p>정현님</p>
                  <p>♔ Grandmaster</p>
                </UserDetails>
                <EloBadge>
                  <span>2187 ELO</span>
                </EloBadge>
              </UserInfo>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <Button 
              onClick={onLogin}
              style={{
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                color: 'white',
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
              }}
            >
              로그인
            </Button>
          )}
          
          <MobileMenuButton variant="ghost" size="sm">
            <Menu size={20} />
          </MobileMenuButton>
        </AuthSection>
      </HeaderContent>
    </HeaderContainer>
  );
}