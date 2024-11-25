import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth.config';

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    // 챕터 조회 (스토리 정보 포함)
    const chapter = await prisma.chapter.findUnique({
      where: { id: (await params).id },
      select: {
        id: true,
        title: true,
        content: true,
        sequence: true,
        createdAt: true,
        storyId: true,
        story: {
          select: {
            id: true,
            title: true,
            userId: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: '챕터를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 이전/다음 챕터 정보 조회
    const [previousChapter, nextChapter] = await Promise.all([
      prisma.chapter.findFirst({
        where: {
          storyId: chapter.storyId,
          sequence: { lt: chapter.sequence },
        },
        orderBy: { sequence: 'desc' },
        select: { id: true },
      }),
      prisma.chapter.findFirst({
        where: {
          storyId: chapter.storyId,
          sequence: { gt: chapter.sequence },
        },
        orderBy: { sequence: 'asc' },
        select: { id: true },
      }),
    ]);

    return NextResponse.json({
      chapter,
      story: chapter.story,
      navigation: {
        previousChapterId: previousChapter?.id,
        nextChapterId: nextChapter?.id,
      },
    });
  } catch (error) {
    console.error('챕터 조회 에러:', error);
    return NextResponse.json({ error: '챕터 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  {params}: {params: Promise<{id: string}>}
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const data = await request.json();

    // 챕터 소유권 확인
    const chapter = await prisma.chapter.findUnique({
      where: { id: (await params).id },
      include: {
        story: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: '챕터를 찾을 수 없습니다.' }, { status: 404 });
    }

    if (chapter.story.userId !== session.user.id) {
      return NextResponse.json({ error: '수정 권한이 없습니다.' }, { status: 403 });
    }

    // 챕터 업데이트
    const updatedChapter = await prisma.chapter.update({
      where: { id: (await params).id },
      data: {
        title: data.title,
        content: data.content,
      },
    });

    return NextResponse.json(updatedChapter);
  } catch (error) {
    console.error('챕터 수정 에러:', error);
    return NextResponse.json({ error: '챕터 수정에 실패했습니다.' }, { status: 500 });
  }
}
