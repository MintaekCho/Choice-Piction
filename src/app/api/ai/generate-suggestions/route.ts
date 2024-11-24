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
    const { content, character, genre, chapterContext, title, preview } = await request.json();
  try {

    if (!title || !character || !genre) {
      return NextResponse.json({ error: '필요한 정보가 부족합니다.' }, { status: 400 });
    }
    console.log(chapterContext);

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
    // 캐릭터 정보
    const characterName = character.name; // 캐릭터 이름
    const characterPersonality = character.personality; // 캐릭터 성격
    const characterAppearance = character.appearance; // 캐릭터 외모
    const characterRole = character.role; // 캐릭터 역할
    const characterBackStory = character.backStory; // 캐릭터 배경 스토리
    const stats = JSON.stringify(character.stats); // 캐릭터 스텟

    const stringifiedContext = JSON.stringify(context);
    console.log(stringifiedContext);

    const prompt = `
    소설제목: ${title || ''}
    장르: ${genre || ''}
    소설 소개: ${preview || ''}
    이전 내용: ${content || '없음'}
    너는 전도유망한 ${genre || ''} 소설가야. ${genre || ''}의 대표적인 소설들을 탐독하며 ${genre || ''} 소설 쓰는 법을 공부했고 벌써 12권짜리 시리즈도 성공적으로 연재한 작가지. 그런 네가 이제 다음 ${title || ''} 소설의 이후 내용을 집필하려고 해.

    제안 내용은 반드시 다음 내용을 참고해서 작성해줘.  
    1. 캐릭터 이름: ${characterName || ''}
    2. 캐릭터 성격: ${characterPersonality || ''}
    3. 캐릭터 외모: ${characterAppearance || ''}
    4. 캐릭터 역할: ${characterRole || ''}
    5. 캐릭터 배경 스토리: ${characterBackStory || ''}
    6. 캐릭터 스텟: ${stats || ''}

    조건:
    1. 내용의 흐름은 이전 내용과 이어져서 매우 자연스러워야 해.
    2. 이전 내용이 '없음' 이면 소설의 첫 내용을 작성해줘.
    3. 소설의 첫 내용을 작성하는 경우는 프롤로그부터 작성해주고 각 제안마다 3문단으로 작성해줘. (세계관, 등장인물, 배경 설정 등)
    4. 등장인물들간의 대화 내용도 한국 웹소설 작가가 쓰는 것처럼 자연스럽게 작성해줘.
    5. 대화 내용을 작성할 때는 이름: 대화 내용 형식으로 작성해줘.
    ex) 사람1: 사람2야 안녕 나는 사람1이야. 사람2: 응 안녕 사람1아 잘 지냈어?

    다시말하지만 너는 전도유망한 웹소설 작가이고 나한테 소설의 내용을 제안해주는거야.
    소설 내용은 suggestions 배열에 서로 다른 선택지의 3개의 제안을 넣어서 제공해주고, 제안 내용은 각각 3문단으로 작성해줘. 그 중 하나의 선택지를 내가 선택할거야.
     응답은 반드시 다음과 같은 JSON 형식이어야 해.
     {
       "suggestions": ['', '', ''],
      chapter_summary?: {
        keyEvents: string[];
        characterDevelopment: string[];
      };
     }
    `;

    console.log(prompt);

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });
    console.log(completion);
    const response = completion.choices[0].message.content;
    return NextResponse.json(JSON.parse(response || ''));
  } catch (error) {
    console.error('AI 제안 생성 실패:', error);
    return NextResponse.json({ error: 'AI 제안 생성에 실패했습니다.' }, { status: 500 });
  }
}
