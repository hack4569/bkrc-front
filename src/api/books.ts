import { api } from './client'
import type { RecommendView } from '../types'

export async function getRecommendBooks(): Promise<RecommendView[]> {
  const { data } = await api.get<RecommendView[]>('/v1/aladin/books/recommend/user')
  return data
}
