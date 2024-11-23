import { Home, Users, BookOpen, Crown, Star, Search, Bell, Settings, HelpCircle, LogIn, LogOut, UserPlus } from 'lucide-react';

// 비로그인 상태의 메뉴 항목
const GUEST_MENU_ITEMS = {
  main: [
    { 
      id: 'home',
      label: '홈', 
      path: '/', 
      icon: Home,
      description: '메인 화면으로 이동'
    },
  ],
  explore: [
    {
      id: 'popular',
      label: '인기 작품',
      path: '/explore/popular',
      icon: Crown,
      description: '실시간 인기 작품'
    },
    {
      id: 'new',
      label: '새로운 작품',
      path: '/explore/new',
      icon: Star,
      description: '최신 등록 작품'
    },
  ],
  auth: [
    {
      id: 'login',
      label: '로그인',
      path: '/login',
      icon: LogIn,
      description: '로그인하고 더 많은 기능 사용하기'
    },
    {
      id: 'register',
      label: '회원가입',
      path: '/register',
      icon: UserPlus,
      description: '새로운 계정 만들기'
    },
  ],
};

// 로그인 상태의 메뉴 항목
const USER_MENU_ITEMS = {
  main: [
    { 
      id: 'home',
      label: '홈', 
      path: '/', 
      icon: Home,
      description: '메인 화면으로 이동'
    },
  ],
  creation: [
    {
      id: 'characters',
      label: '내 캐릭터',
      path: '/characters',
      icon: Users,
      description: '보유 캐릭터 관리'
    },
    {
      id: 'stories',
      label: '내 스토리',
      path: '/stories',
      icon: BookOpen,
      description: '작성중인 스토리'
    },
  ],
  explore: [
    {
      id: 'popular',
      label: '인기 작품',
      path: '/explore/popular',
      icon: Crown,
      description: '실시간 인기 작품'
    },
    {
      id: 'new',
      label: '새로운 작품',
      path: '/explore/new',
      icon: Star,
      description: '최신 등록 작품'
    },
    {
      id: 'search',
      label: '작품 검색',
      path: '/explore/search',
      icon: Search,
      description: '키워드로 검색'
    },
  ],
  user: [
    {
      id: 'notifications',
      label: '알림',
      path: '/notifications',
      icon: Bell,
      description: '알림 센터'
    },
    {
      id: 'settings',
      label: '설정',
      path: '/settings',
      icon: Settings,
      description: '계정 설정'
    },
    {
      id: 'help',
      label: '도움말',
      path: '/help',
      icon: HelpCircle,
      description: '이용 가이드'
    },
    {
      id: 'logout',
      label: '로그아웃',
      path: '/logout',
      icon: LogOut,
      description: '안전하게 로그아웃'
    },
  ],
};

export const getMenuItems = (isLoggedIn: boolean) => {
  return isLoggedIn ? USER_MENU_ITEMS : GUEST_MENU_ITEMS;
}; 