'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Background } from '@/components/Background';
import { useAuth } from '@/hooks/useAuth';
import { MainLayoutContainer, MainContent } from '@/components/styled/Layout.styled';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <MainLayoutContainer>
      <Background />
      
      <Header 
        activeSection="dashboard"
        onNavigate={() => {}}
        isLoggedIn={isLoggedIn}
        onLogin={login}
        onLogout={logout}
      />

      <MainContent>
        {children}
      </MainContent>
    </MainLayoutContainer>
  );
}
