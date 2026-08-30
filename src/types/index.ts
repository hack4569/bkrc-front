export type BookCategory = string

// 한 책 안에서 위아래로 넘겨보는 한 페이지(섹션).
// 원본 퍼블 파일의 세 가지 섹션 스타일에 매핑된다.
//   quote  → summary-content-section--quote (인용 아이콘 + 큰 글씨)
//   text   → summary-content-section--introduction (라벨 + 본문)
//   review → summary-content-section--review (라벨 + 본문 + 리뷰어 아바타)
//   toc    → 목차 (라벨 + 항목 리스트)
export type TextVariant = 'description' | 'descriptionInsight' | 'ai' | 'md' | 'user'

export type BookPage =
  | { kind: 'quote'; content: string }
  | { kind: 'text'; label: string; variant: TextVariant; content: string }
  | { kind: 'review'; label: string; content: string; reviewer: string }
  | { kind: 'toc'; label: string; items: string[] }

export type Book = {
  id: number
  title: string
  cover: string
  category: BookCategory
  publisher: string
  author: string
  link: string
  color:
    | 'violet' | 'blue' | 'pitch'
    | 'coral' | 'mint' | 'lemon' | 'peach' | 'sky' | 'rose' | 'lavender' | 'sunrise'
    | 'aqua' | 'cherry' | 'honey' | 'seafoam' | 'blossom' | 'citrus' | 'tangerine'
    | 'berry' | 'daybreak'
  // 위아래로 넘겨보는 페이지들 (인용 → 소개 → 핵심 → 추천 → 리뷰)
  pages: BookPage[]
  // 추천 모달용 — 책별 맞춤 추천 문구
  recommendTitle: string
  recommendBody: string
}

export type BookCommentType = 'description' | 'descriptionInsight' | 'aiRecommend' | 'mdRecommend' | 'phrase' | 'toc' | 'user'

export type BookComment = {
  bookCommentId: number
  comment: string
  type: BookCommentType
}

export type RecommendView = {
  itemId: number
  title: string
  link: string
  cover: string
  author: string
  categoryName: string
  recommendCommentList: BookComment[]
}

export type BookSearchItem = {
  itemId: number
  title: string
  author: string
  cover: string
  link: string
}

export type CreateBookRecommendation = {
  itemId: number
  link: string
  cover: string
  title: string
  recommendation: string
}

export type MyRecommendation = {
  itemId: number
  title: string
  cover: string
  link: string
  approved: 'Y' | 'N' | 'W'
  recommendation: string
}

export type LikedBook = {
  likeId: number
  itemId: number
  title: string
  cover: string
  author: string
  publisher: string
  link: string
}

export type LikeResult = {
  itemId: number
  likeCount: number
}

export type UserProfile = {
  loginId: string
  likedBooks: LikedBook[] | null
  recommendedBooks: MyRecommendation[]
}

export type ToggleFavoriteResult = {
  favorite: boolean
  favoriteIds: number[]
}
