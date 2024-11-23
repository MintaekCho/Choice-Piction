import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface ChapterContext {
  currentChapter: {
    content: string;
    sequence: number;
  };
  previousChapter?: {
    summary: string;
    keyEvents: string[];
  };
  characterState: {
    name: string;
    stats: Record<string, number>;
    currentStatus?: string[];
  };
  storySummary?: {
    title: string;
    genre: string;
    mainEvents: string[];
    worldSettings?: string[];
  };
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content, character, genre, chapterContext } = await request.json();

    if (!content || !character || !genre) {
      return NextResponse.json({ error: '필요한 정보가 부족합니다.' }, { status: 400 });
    }

    // 현재 챕터와 이전 챕터의 요약 정보만 포함
    const context: ChapterContext = {
      currentChapter: {
        content: content,
        sequence: chapterContext?.currentChapter?.sequence || 1,
      },
      previousChapter: chapterContext?.previousChapter && {
        summary: chapterContext.previousChapter.summary,
        keyEvents: chapterContext.previousChapter.keyEvents,
      },
      characterState: {
        name: character.name,
        stats: character.stats,
        currentStatus: chapterContext?.characterState?.currentStatus,
      },
      storySummary: chapterContext?.storySummary,
    };

    const prompt = `당신은 현대 한국의 먼치킨 장르를 완벽히 이해하는 소설 작가입니다.
     다음 상황과 컨텍스트를 기반으로 흥미로운 스토리 전개 3가지를 제안해주세요.

    특징:
    - 장르와 장르의 크로스오버를 통한 신선한 설정
    - 현대의 게임/웹툰/웹소설 문화를 반영한 메타적 요소
    - 유쾌하고 재치있는 반전을 통한 몰입감 강화
    - 2024년 한국 먼치킨 장르에 맞는 주제 선정
    - 상황에 따라 새로운 등장인물 제시

    절대 하지 말아야 할 것:
    - 진부하고 뻔한 선택지 제시
    - 이전 챕터와의 연결성 무시
    - 캐릭터의 현재 상태와 맞지 않는 전개

    스토리 컨텍스트:
    ${JSON.stringify(context, null, 2)}

    장르: ${genre}

    응답 형식:
    {
      suggestions: string[];
      supporting_characters?: {
        name: string;
        role: string;
        backStory: string;
      }[];
      chapter_summary?: {
        keyEvents: string[];
        characterDevelopment: string[];
      };
    }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(response || '[]'));
  } catch (error) {
    console.error('AI 제안 생성 실패:', error);
    return NextResponse.json({ error: 'AI 제안 생성에 실패했습니다.' }, { status: 500 });
  }
}
