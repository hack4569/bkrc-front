import type { RecommendView } from '../types'

// Browser typography verification only. The production API response is unchanged.
const atLength = (text: string, length: number) => text.repeat(Math.ceil(length / text.length)).slice(0, length)

const fixtureCopy = {
  insight: atLength('낯선 면역의 언어를 일상의 감각으로 풀어내며 우리 몸 안에서 벌어지는 작은 전투가 삶을 이해하는 새로운 창이 된다는 사실을 차분히 보여 줍니다. ', 149),
  description: atLength('이 책은 복잡한 지식을 서두르지 않고 한 걸음씩 안내합니다. 질문에서 출발해 사례와 설명을 쌓고 오늘의 삶에 적용할 여백을 남깁니다. ', 157),
  essence: atLength('핵심은 몸을 이해하는 일이 곧 삶의 리듬을 이해하는 일이라는 데 있습니다. ', 68),
  quote: atLength('우리가 매일 무심히 지나치는 몸의 작은 신호에도 이야기가 있습니다. 이 책은 그 이야기를 천천히 듣게 하고 오늘의 관찰에서 돌봄이 시작된다고 말합니다. ', 143),
}

export const typographyFixtureBooks: RecommendView[] = [{
  itemId: 901,
  title: '혼합 서체 검수용 도서',
  link: 'https://www.aladin.co.kr/',
  cover: '/img/book_immune.png',
  author: 'BookerT',
  categoryName: '검수',
  recommendCommentList: [
    { bookCommentId: 901, type: 'descriptionInsight', comment: fixtureCopy.insight },
    { bookCommentId: 902, type: 'description', comment: fixtureCopy.description },
    { bookCommentId: 903, type: 'aiRecommend', comment: fixtureCopy.essence },
    { bookCommentId: 904, type: 'phrase', comment: fixtureCopy.quote },
    { bookCommentId: 905, type: 'toc', comment: '첫 번째 목차 항목\n두 번째 목차 항목\n세 번째 목차 항목' },
    { bookCommentId: 906, type: 'mdRecommend', comment: fixtureCopy.description },
  ],
}]