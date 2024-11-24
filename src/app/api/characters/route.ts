import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth.config';
import { CharacterModel } from '@/types';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const data = await request.json();
    
    // 필수 필드 검증
    if (!data.name || !data.gender || !data.age || !data.appearance || !data.personality || !data.background) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // 캐릭터 이름 중복 검사
    const existingCharacter = await prisma.character.findFirst({
      where: {
        name: data.name,
        userId: session.user.id,
      },
    });

    if (existingCharacter) {
      return NextResponse.json({ 
        error: '이미 사용 중인 캐릭터 이름입니다.' 
      }, { status: 400 });
    }

    // stats 객체를 문자열로 변환
    const statsString = JSON.stringify(data.stats || {
      appearance: 0,
      charisma: 0,
      speech: 0,
      luck: 0,
      wit: 0
    });

    // 캐릭터 생성
    const character = await prisma.character.create({
      data: {
        userId: session.user.id,
        name: data.name,
        gender: data.gender,
        age: Number(data.age),
        appearance: data.appearance,
        personality: data.personality,
        background: data.background,
        profileImage: data.profileImage || null,
        stats: statsString,
      },
    });

    if (!character) {
      throw new Error('캐릭터 생성 실패');
    }

    // 생성된 캐릭터 반환 시 stats를 다시 객체로 변환
    return NextResponse.json({
      ...character,
      stats: JSON.parse(character.stats)
    });

  } catch (error) {
    console.log('error', error)
    // Prisma unique constraint violation error
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: '이미 사용 중인 캐릭터 이름입니다.' 
      }, { status: 400 });
    }

    console.error('캐릭터 생성 에러:', error);
    return NextResponse.json({ error: '캐릭터 생성에 실패했습니다.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const characters = await prisma.character.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // stats 문자열을 객체로 변환
    const parsedCharacters: CharacterModel[] = characters.map((character: CharacterModel) => ({
      ...character,
      stats: JSON.parse(character.stats as string)
    }));

    return NextResponse.json(parsedCharacters);
  } catch (error) {
    console.error('캐릭터 목록 조회 에러:', error);
    return NextResponse.json({ error: '캐릭터 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
} 