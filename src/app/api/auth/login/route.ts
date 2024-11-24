import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 검증
    const isValid = await compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // 비밀번호를 제외한 사용자 정보 반환
    const { ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('로그인 에러:', error);
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 