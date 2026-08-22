import { api } from './client'
import type {
  BookSearchItem,
  CreateBookRecommendation,
  MyRecommendation,
  RecommendView,
} from '../types'

export async function getRecommendBooks(): Promise<RecommendView[]> {
  const { data } = await api.get<RecommendView[]>('/v1/aladin/books/recommend/user', {
    skipAuth: true,
    skipAuthRedirect: true,
  })
  return data
}

export async function searchBooks(query: string): Promise<BookSearchItem[]> {
  const { data } = await api.get<BookSearchItem[]>('/v1/aladin/books/search', {
    params: { query },
  })
  return data
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
