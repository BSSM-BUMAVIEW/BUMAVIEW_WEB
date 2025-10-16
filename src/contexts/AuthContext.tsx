'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, type AuthResponse, type AuthRequest } from '../lib/api';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 토큰만 있어도 인증된 상태로 간주 (백엔드가 사용자 정보를 반환하지 않는 경우 대응)
  const isAuthenticated = !!token;

  // 컴포넌트 마운트 시 저장된 토큰 확인 (검증 없이 바로 로드)
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && typeof parsed === 'object') {
          setUser(parsed);
          console.log('✅ 저장된 로그인 정보 복원:', parsed);
        }
      } catch (e) {
        console.warn('⚠️ 저장된 사용자 정보 파싱 실패. 초기화합니다.');
        localStorage.removeItem('auth_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.login({ email, password });
      // 응답에서 토큰/유저가 유효한지 검증 후 저장
      // 백엔드 응답: { accessToken, grantType, refreshToken, ... }
      // 또는 { token, user }
      const tokenFromServer = (response as any)?.token ?? (response as any)?.accessToken;
      const userFromServer = (response as any)?.user;
      if (tokenFromServer && tokenFromServer !== 'undefined' && tokenFromServer !== 'null') {
        setToken(tokenFromServer);
        localStorage.setItem('auth_token', tokenFromServer);
      } else {
        localStorage.removeItem('auth_token');
      }

      if (userFromServer) {
        setUser(userFromServer);
        localStorage.setItem('auth_user', JSON.stringify(userFromServer));
      } else {
        // 사용자 정보가 없더라도 최소한 이메일 기반의 표시용 사용자 생성
        const fallbackUser = { id: 0, email, name: email } as any;
        setUser(fallbackUser);
        localStorage.setItem('auth_user', JSON.stringify(fallbackUser));
      }
      
      console.log('로그인 성공:', response.user);
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.signup({ email, password, name });
      const tokenFromServer = (response as any)?.token ?? (response as any)?.accessToken;
      const userFromServer = (response as any)?.user;
      if (tokenFromServer && tokenFromServer !== 'undefined' && tokenFromServer !== 'null') {
        setToken(tokenFromServer);
        localStorage.setItem('auth_token', tokenFromServer);
      } else {
        localStorage.removeItem('auth_token');
      }

      if (userFromServer) {
        setUser(userFromServer);
        localStorage.setItem('auth_user', JSON.stringify(userFromServer));
      } else {
        const fallbackUser = { id: 0, email, name } as any;
        setUser(fallbackUser);
        localStorage.setItem('auth_user', JSON.stringify(fallbackUser));
      }
      
      console.log('회원가입 성공:', response.user);
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    console.log('로그아웃 완료');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
