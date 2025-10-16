import React, { useState } from 'react';
import { Button } from './ui/button';
import { Crown, Users, Search, Trophy, Target, Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavigationProps } from '../types';
import { APP_TEXTS } from '../constants/texts';
import { useAuth } from '../contexts/AuthContext';
import { LoginModal } from './LoginModal';
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
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: APP_TEXTS.navigation.dashboard, icon: Crown, href: '/dashboard' },
    { id: 'battle', label: APP_TEXTS.navigation.interviewBattle, icon: Users, href: '/battle' },
    { id: 'search', label: APP_TEXTS.navigation.strategySearch, icon: Search, href: '/search' },
    { id: 'rankings', label: APP_TEXTS.navigation.masterRanking, icon: Trophy, href: '/rankings' },
    { id: 'mock', label: APP_TEXTS.navigation.soloTraining, icon: Target, href: '/mock' },
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoSection>
          <LogoIcon>
            <Crown size={28} color="white" />
          </LogoIcon>
          <LogoText>
            <h1>{APP_TEXTS.appName}</h1>
            <p>{APP_TEXTS.appNameEnglish}</p>
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
          {isAuthenticated && user ? (
            <>
              <UserInfo>
                <UserAvatar>
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>♛</span>
                </UserAvatar>
                <UserDetails>
                  <p>{user.name}님</p>
                  <p>Normal</p>
                </UserDetails>
                <EloBadge>
                  <span>0 ELO</span>
                </EloBadge>
              </UserInfo>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => authLogout()}
                className="flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setShowLoginModal(true)}
              style={{
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                color: 'white',
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
              }}
            >
              {APP_TEXTS.navigation.login}
            </Button>
          )}
          
          <MobileMenuButton variant="ghost" size="sm">
            <Menu size={20} />
          </MobileMenuButton>
        </AuthSection>
      </HeaderContent>
      
      {/* 로그인 모달 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </HeaderContainer>
  );
}