import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth.config';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: '캐릭터 이름이 필요합니다.' }, { status: 400 });
    }

    // 캐릭터 이름 중복 검사
    const existingCharacter = await prisma.character.findFirst({
      where: {
        name,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ 
      isAvailable: !existingCharacter,
      message: existingCharacter ? '이미 사용 중인 캐릭터 이름입니다.' : '사용 가능한 이름입니다.'
    });

  } catch (error) {
    console.error('캐릭터 이름 검사 에러:', error);
    return NextResponse.json({ error: '이름 검사에 실패했습니다.' }, { status: 500 });
  }
} 