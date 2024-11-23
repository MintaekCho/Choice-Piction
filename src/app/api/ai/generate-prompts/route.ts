import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { character, genre } = await request.json();
    console.log(character, genre);

    if (character && genre) {
      const prompt = `당신은 현대 한국의 ${genre} 장르를 완벽히 이해하는 웹소설 작가입니다.
     다음 캐릭터정보 장르를 기반으로 흥미로운 스토리 시작점 3가지를 제안해주세요.

특징:
- 장르와 장르의 크로스오버를 통한 신선한 설정
- 현대의 게임/웹툰/웹소설 문화를 반영한 메타적 요소
- 유쾌하고 재치있는 반전을 통한 몰입감 강화
- 2024년 한국 ${genre} 장르에 맞는 주제 선정
- 제목을 좀 더 2024년 웹툰, 웹소설 장르에 맞게 설정
- 제목에 character 이름이 들어가지 않을 것 ex) OOO의 모험, OOO의 선택 등
- 설명도 좀 더 2024년 웹툰, 웹소설처럼 20~30대들이 흥미를 보일 수 있게끔 자극적으로 설정

절대 하지 말아야 할 것:
- 진부하고 뻔한 선택지 제시
    
캐릭터 정보:
- 이름: ${character.name}
- 나이: ${character.age}세
- 성격: ${character.personality || '미정'}
- 주요 능력치: 
  * 외모: ${character.stats.appearance}
  * 매력: ${character.stats.charisma}
  * 말솜씨: ${character.stats.speech}
  * 운: ${character.stats.luck}
  * 지능: ${character.stats.wit}

각 제안은 다음 형식으로 작성해주세요:
{
  "title": "제목",
  "description": "한 줄 설명",
  "preview": "도입부 내용 (2-3문장)"
}

응답은 JSON 배열 형식으로 해주세요.`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      console.log(completion);

      const response = completion.choices[0].message.content;
      return NextResponse.json(JSON.parse(response || '[]'));
    }
    return NextResponse.json({ error: '캐릭터 또는 장르 정보가 없습니다.' }, { status: 400 });
  } catch (error) {
    console.error('AI 프롬프트 생성 실패:', error);
    return NextResponse.json({ error: 'AI 프롬프트 생성에 실패했습니다.' }, { status: 500 });
  }
}
