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

    const data = await request.json();
    const { title, content, storyId, sequence } = data;

    // 먼저 같은 sequence를 가진 챕터가 있는지 확인
    const existingChapter = await prisma.chapter.findFirst({
      where: {
        storyId,
        sequence,
      },
    });

    let chapter;
    
    if (existingChapter) {
      // 기존 챕터가 있다면 업데이트
      chapter = await prisma.chapter.update({
        where: {
          id: existingChapter.id,
        },
        data: {
          title,
          content,
        },
      });
    } else {
      // 새로운 챕터 생성
      chapter = await prisma.chapter.create({
        data: {
          title,
          content,
          sequence,
          storyId,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('챕터 저장 에러:', error);
    return NextResponse.json({ error: '챕터 저장에 실패했습니다.' }, { status: 500 });
  }
} 