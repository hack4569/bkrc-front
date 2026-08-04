import { api } from './client'
import type {
  BookSearchItem,
  CreateBookRecommendation,
  MyRecommendation,
  RecommendView,
} from '../types'

export async function getRecommendBooks(): Promise<RecommendView[]> {
  const { data } = await api.get<RecommendView[]>('/v1/aladin/books/recommend/user')
  return data
}

type BookSearchResponse = BookSearchItem[] | {
  item?: BookSearchItem[]
  aladinBookResponseList?: BookSearchItem[]
}

export async function searchBooks(query: string): Promise<BookSearchItem[]> {
  const response = await fetch(`/api/aladin/search?${new URLSearchParams({ Query: query })}`)
  const data = await response.json() as BookSearchResponse & { detail?: string }
  if (!response.ok) throw new Error(data.detail || '책을 검색하지 못했습니다.')

  if (Array.isArray(data)) return data
  return data.item ?? data.aladinBookResponseList ?? []
}

export async function createBookRecommendation(
  payload: CreateBookRecommendation,
): Promise<void> {
  await api.post('/v1/aladin/books/recommend/user', payload)
}

export async function updateBookRecommendation(
  itemId: number,
  recommendation: string,
): Promise<void> {
  await api.put(`/v1/aladin/books/recommend/${itemId}`, { recommendation })
}

export async function getBookRecommendation(itemId: number): Promise<MyRecommendation> {
  const { data } = await api.get<MyRecommendation>(`/v1/aladin/books/recommend/${itemId}`)
  return data
}
