'use client';

import styled from 'styled-components';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
`;

export const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const LogoIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(to bottom right, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
`;

export const LogoText = styled.div`
  h1 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  
  p {
    font-size: 0.75rem;
    color: #2563eb;
    margin: 0;
  }
`;

export const Navigation = styled.nav`
  display: none;
  align-items: center;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

export const NavButton = styled(Button)<{ $isActive: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  
  ${props => props.$isActive ? `
    background: #dbeafe;
    color: #1d4ed8;
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1);
    border: 1px solid #bfdbfe;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, #dbeafe, #e9d5ff);
      border-radius: 0.5rem;
      z-index: -1;
    }
  ` : `
    color: #475569;
    
    &:hover {
      color: #1e293b;
      background: #f8fafc;
    }
  `}
`;

export const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const UserInfo = styled.div`
  display: none;
  align-items: center;
  gap: 0.75rem;
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

export const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(to bottom right, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
`;

export const UserDetails = styled.div`
  font-size: 0.875rem;
  
  p:first-child {
    font-weight: 500;
    color: #1e293b;
    margin: 0;
  }
  
  p:last-child {
    font-size: 0.75rem;
    color: #2563eb;
    margin: 0;
  }
`;

export const EloBadge = styled.div`
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  border-radius: 9999px;
  border: 1px solid #bfdbfe;
  
  span {
    font-size: 0.75rem;
    color: #1d4ed8;
  }
`;

export const MobileMenuButton = styled(Button)`
  display: flex;
  
  @media (min-width: 768px) {
    display: none;
  }
`;
