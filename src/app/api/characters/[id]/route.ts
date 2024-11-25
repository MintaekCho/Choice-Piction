import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth.config';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const character = await prisma.character.findUnique({
      where: {
        id: (await params).id,
      },
      include: {
        stories: true,
      },
    });

    if (!character) {
      return NextResponse.json({ error: '캐릭터를 찾을 수 없습니다.' }, { status: 404 });
    }

    // stats 문자열을 객체로 변환
    return NextResponse.json({
      ...character,
      stats: JSON.parse(character.stats as string)
    });

  } catch (error) {
    console.error('캐릭터 조회 에러:', error);
    return NextResponse.json({ error: '캐릭터 조회에 실패했습니다.' }, { status: 500 });
  }
} 