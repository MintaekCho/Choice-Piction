import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const { title, description, genre, mainCharacterId } = await request.json();

    // 필수 필드 검증
    if (!title || !description || !genre || !mainCharacterId) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // 캐릭터 소유권 확인
    const character = await prisma.character.findUnique({
      where: {
        id: mainCharacterId,
        userId: session.user.id,
      },
    });

    if (!character) {
      return NextResponse.json({ error: '캐릭터를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 스토리 생성
    const story = await prisma.story.create({
      data: {
        userId: session.user.id,
        title,
        description,
        genre: Array.isArray(genre) ? genre : [genre],
        mainCharacterId,
        status: 'DRAFT',
      },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error('스토리 생성 에러:', error);
    return NextResponse.json({ error: '스토리 생성에 실패했습니다.' }, { status: 500 });
  }
}

// 사용자의 스토리 목록 조회
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const stories = await prisma.story.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        mainCharacter: true,
        chapters: {
          orderBy: {
            sequence: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error('스토리 목록 조회 에러:', error);
    return NextResponse.json({ error: '스토리 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
} 