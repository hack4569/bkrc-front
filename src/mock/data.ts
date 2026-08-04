export interface BookComment {
  bookCommentId: number
  comment: string
  type: 'phrase' | 'description' | 'aiRecommend' | 'mdRecommend' | 'toc'
}

export interface RecommendView {
  itemId: number
  title: string
  link: string
  cover: string
  author: string
  categoryName: string
  recommendCommentList: BookComment[]
}

export interface MockUser {
  loginId: string
  likedBooks: LikedBook[]
  recommendedBooks: {
    itemId: number
    title: string
    cover: string
    link: string
    approved: 'Y' | 'N' | 'W'
    recommendation: string
  }[]
}

export interface LikedBook {
  likeId: number
  itemId: number
  title: string
  cover: string
  author: string
  publisher: string
  link: string
}

export const mockBooks: RecommendView[] = [
  {
    itemId: 1,
    title: '면역',
    link: 'https://www.aladin.co.kr/',
    cover: '/img/book_immune.png',
    author: '필리프 데트머',
    categoryName: '자기계발서',
    recommendCommentList: [
      {
        bookCommentId: 1,
        comment: '지금 이 문장을 읽는 순간에도, 당신의 몸속에서는 수백만의 세포가 침입자와 싸우고 있다.',
        type: 'phrase',
      },
      {
        bookCommentId: 2,
        comment:
          '유튜브 과학 채널 쿠르츠게작트의 창립자 필리프 데트머가, 우리 몸을 지키는 면역 체계의 작동 원리를 누구나 이해할 수 있는 언어로 풀어낸 과학 교양서입니다. 세균과 바이러스가 몸에 침투한 순간부터 면역 세포들이 벌이는 전쟁을, 마치 한 편의 다큐멘터리처럼 따라가게 됩니다.',
        type: 'description',
      },
      {
        bookCommentId: 3,
        comment: '복잡한 면역학을 이토록 흥미진진한 이야기로 바꿔낸 책은 없었다. 한 장을 넘길 때마다 내 몸을 새롭게 보게 된다.',
        type: 'aiRecommend',
      },
    ],
  },
  {
    itemId: 2,
    title: '사랑의 기술',
    link: 'https://www.aladin.co.kr/',
    cover: '/img/book_art-of-love.png',
    author: '에리히 프롬',
    categoryName: '에세이',
    recommendCommentList: [
      {
        bookCommentId: 4,
        comment: '사랑은 우연히 빠지는 감정이 아니라, 배우고 익혀야 하는 하나의 기술이다.',
        type: 'phrase',
      },
      {
        bookCommentId: 5,
        comment:
          '정신분석학자 에리히 프롬이 1956년에 쓴 이 책은, 사랑을 "빠지는 것"이 아니라 "하는 것"으로 다시 정의합니다. 우리가 사랑에 자꾸 실패하는 이유는 좋은 상대를 못 만나서가 아니라, 사랑하는 능력을 기르지 않았기 때문이라고 말합니다.',
        type: 'description',
      },
      {
        bookCommentId: 6,
        comment: '사랑을 감정이 아닌 의지와 훈련의 문제로 다시 보게 한다. 평생 곁에 두고 다시 읽게 되는 책.',
        type: 'aiRecommend',
      },
    ],
  },
  {
    itemId: 3,
    title: '살인 플롯 짜는 노파',
    link: 'https://www.aladin.co.kr/',
    cover: '/img/book_old-woman.png',
    author: '엘리 그리피스',
    categoryName: '소설',
    recommendCommentList: [
      {
        bookCommentId: 7,
        comment: '명함에는 이렇게 적혀 있었다. "페기 스미스, 살인 자문가."',
        type: 'phrase',
      },
      {
        bookCommentId: 8,
        comment:
          '바닷가 마을의 한 아파트, 평생 추리소설을 읽어온 90세 노부인 페기 스미스가 의자에 앉은 채 숨진 채 발견됩니다. 자연사처럼 보였던 죽음. 그러나 그가 남긴 "살인 자문가" 명함과 서가의 추리소설들이, 따뜻하고 위트 있는 영국식 코지 미스터리의 시작을 알립니다.',
        type: 'description',
      },
      {
        bookCommentId: 9,
        comment: '노부인의 서가에 꽂힌 추리소설마다 그에게 바치는 감사의 말이 있었다. 마지막 장까지 멈출 수 없다.',
        type: 'aiRecommend',
      },
    ],
  },
  {
    itemId: 4,
    title: '당신도 느리게 나이 들 수 있습니다',
    link: 'https://www.aladin.co.kr/',
    cover: '/img/book_grow-old-slowly.png',
    author: '정희원',
    categoryName: '자기계발서',
    recommendCommentList: [
      {
        bookCommentId: 10,
        comment: '나이가 드는 것은 막을 수 없지만, 나이 드는 속도는 바꿀 수 있다.',
        type: 'phrase',
      },
      {
        bookCommentId: 11,
        comment:
          '서울아산병원 노년내과 전문의 정희원 교수가, 한국 사회에 닥친 "가속노화"의 위험을 경고하며 쓴 책입니다. 같은 나이라도 누군가는 빠르게, 누군가는 느리게 늙습니다. 그 차이를 만드는 것은 유전이 아니라 매일 쌓아온 습관이라고 말합니다.',
        type: 'description',
      },
      {
        bookCommentId: 12,
        comment: '과장 없이 의학적 근거로 일상 습관을 다시 설계하게 만든다. 건강서가 빠지기 쉬운 함정을 피해 간다.',
        type: 'aiRecommend',
      },
    ],
  },
  {
    itemId: 5,
    title: '생각하라 그리고 부자가 되어라',
    link: 'https://www.aladin.co.kr/',
    cover: '/img/book_think-and-grow-rich.png',
    author: '나폴레온 힐',
    categoryName: '자기계발서',
    recommendCommentList: [
      {
        bookCommentId: 13,
        comment: '간절히 바라고 굳게 믿고 꾸준히 행동하는 것은, 무엇이든 이루어진다.',
        type: 'phrase',
      },
      {
        bookCommentId: 14,
        comment:
          '철강왕 앤드루 카네기의 의뢰를 받은 나폴레온 힐이, 20년에 걸쳐 성공한 사람 500여 명을 직접 연구해 정리한 자기계발의 고전입니다. 1937년 처음 출간된 이후 전 세계에서 수천만 부가 팔리며, 오늘날 수많은 성공학 책의 원형이 되었습니다.',
        type: 'description',
      },
      {
        bookCommentId: 15,
        comment: '출간 80여 년이 지나도 사라지지 않는 이유. 부의 출발점이 결국 생각에 있음을 일깨운다.',
        type: 'aiRecommend',
      },
    ],
  },
  {
    itemId: 6,
    title: '서쪽 바람',
    link: 'https://www.aladin.co.kr/',
    cover: '/img/book_west-wind.png',
    author: '메리 올리버',
    categoryName: '에세이',
    recommendCommentList: [
      {
        bookCommentId: 16,
        comment: '그저 살아 있다는 것, 그리고 그 사실에 매일 놀라워한다는 것.',
        type: 'phrase',
      },
      {
        bookCommentId: 17,
        comment:
          '퓰리처상과 전미도서상을 받은 미국 시인 메리 올리버가, 자연과 일상의 풍경에서 길어 올린 산문시들을 묶은 시집입니다. 어려운 비유나 난해한 상징 없이, 바닷가의 빛과 바람, 풀과 새 같은 작은 것들을 가만히 응시하며 마음을 천천히 가라앉혀 줍니다.',
        type: 'description',
      },
      {
        bookCommentId: 18,
        comment: '바닷가의 빛과 바람을 닮은 문장들. 한 편씩 천천히 읽으면 어느새 마음이 가라앉는다.',
        type: 'aiRecommend',
      },
    ],
  },
]

export const mockUser: MockUser = {
  loginId: 'user',
  likedBooks: [],
  recommendedBooks: [
    {
      itemId: mockBooks[0].itemId,
      title: mockBooks[0].title,
      cover: mockBooks[0].cover,
      link: mockBooks[0].link,
      approved: 'W',
      recommendation: '복잡한 면역학을 쉽고 재미있게 이해하고 싶은 분께 추천합니다.',
    },
  ],
}
