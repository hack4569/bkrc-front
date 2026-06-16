import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({ baseURL })

// 요청 인터셉터 — 저장된 JWT를 Authorization 헤더에 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 응답 인터셉터 — 토큰 만료/무효(401·403)면 로그아웃 후 로그인 페이지로.
// 무효 토큰으로 좋아요·기록 등 보호 API 호출 시 403이 떨어지므로 401과 동일 처리.
// 단 로그인 요청 자체의 401(인증 실패)은 리다이렉트하지 않고 폼에서 에러를 보여준다.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url: string = err.config?.url ?? ''
    const isLoginRequest = url.includes('/login')
    const status = err.response?.status
    if ((status === 401 || status === 403) && !isLoginRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('loginId')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)
