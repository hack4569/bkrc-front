import { AxiosError } from 'axios'

// RFC 9457 ProblemDetail (BE 에러 응답 형식)
type ProblemDetail = {
  detail?: string
  errorCode?: string
  status?: number
}

// 서버가 내려준 detail 메시지를 우선 사용하고, 없으면 fallback.
export function getErrorMessage(err: unknown, fallback: string): string {
  const data = (err as AxiosError<ProblemDetail>)?.response?.data
  const detail = typeof data?.detail === 'string' ? data.detail.trim() : ''
  return detail || fallback
}
