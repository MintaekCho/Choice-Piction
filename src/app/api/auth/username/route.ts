import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const { username } = await request.json();

    // 유효성 검사
    if (!username || username.length < 2 || username.length > 20) {
      return NextResponse.json({ error: '필명은 2-20자 이내여야 합니다.' }, { status: 400 });
    }

    // 중복 검사
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: '이미 사용 중인 필명입니다.' }, { status: 400 });
    }

    // 필명 업데이트
    await prisma.user.update({
      where: { email: session.user.email },
      data: { username },
    });


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('필명 등록 에러:', error);
    return NextResponse.json({ error: '필명 등록에 실패했습니다.' }, { status: 500 });
  }
}
