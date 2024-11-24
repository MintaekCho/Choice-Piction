import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth.config';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const story = await prisma.story.findUnique({
      where: { id: params.id },
      include: {
        mainCharacter: {
          select: {
            id: true,
            name: true,
            gender: true,
            age: true,
            profileImage: true,
            appearance: true,
            personality: true,
            background: true,
            stats: true,
          },
        },
        chapters: {
          orderBy: {
            sequence: 'asc',
          },
        },
      },
    });

    if (!story) {
      return NextResponse.json({ error: '스토리를 찾을 수 없습니다.' }, { status: 404 });
    }

    const storyWithParsedCharacter = {
      ...story,
      mainCharacter: {
        ...story.mainCharacter,
        stats: JSON.parse(story.mainCharacter.stats as string)
      }
    };

    await prisma.story.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(storyWithParsedCharacter);
  } catch (error) {
    console.error('스토리 조회 에러:', error);
    return NextResponse.json({ error: '스토리 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    // 스토리 소유권 확인
    const story = await prisma.story.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!story) {
      return NextResponse.json({ error: '스토리를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 스토리와 관련된 모든 데이터 삭제
    await prisma.$transaction([
      prisma.vote.deleteMany({
        where: { storyId: params.id },
      }),
      prisma.review.deleteMany({
        where: { storyId: params.id },
      }),
      prisma.choice.deleteMany({
        where: {
          chapter: {
            storyId: params.id,
          },
        },
      }),
      prisma.chapter.deleteMany({
        where: { storyId: params.id },
      }),
      prisma.story.delete({
        where: { id: params.id },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('스토리 삭제 에러:', error);
    return NextResponse.json({ error: '스토리 삭제에 실패했습니다.' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const data = await request.json();

    // 스토리 소유권 확인
    const story = await prisma.story.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!story) {
      return NextResponse.json({ error: '스토리를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 스토리 업데이트
    const updatedStory = await prisma.story.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        genre: data.genre,
        status: data.status,
      },
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error('스토리 수정 에러:', error);
    return NextResponse.json({ error: '스토리 수정에 실패했습니다.' }, { status: 500 });
  }
} 