import { api } from './client'
import type { LikeResult, UserProfile } from '../types'

export async function getMe(skipAuthRedirect = false): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/v1/member/me', { skipAuthRedirect })
  return { ...data, recommendedBooks: data.recommendedBooks ?? [] }
}

export async function likeBook(itemId: number): Promise<LikeResult> {
  const { data } = await api.post<LikeResult>(`/v1/like/${itemId}`)
  return data
}

export async function cancelLike(itemId: number): Promise<void> {
  await api.post(`/v1/like/cancel/${itemId}`)
}
