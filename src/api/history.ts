import { api } from './client'

export async function saveHistory(itemId: number): Promise<void> {
  if (!localStorage.getItem('token')) return
  try {
    await api.post(`/v1/history?itemId=${itemId}`)
  } catch {
    // 에러는 무시 — UX에 영향 없이 조용히 실패
  }
}
