import AxiosMockAdapter from 'axios-mock-adapter'
import type { AxiosInstance } from 'axios'
import { mockBooks, mockUser } from './data'
import type { LikedBook } from './data'

const likedSet = new Set<number>()

export function installMockApi(api: AxiosInstance) {
  const mock = new AxiosMockAdapter(api, { delayResponse: 300 })

  // GET /v1/aladin/books/recommend/user
  mock.onGet('/v1/aladin/books/recommend/user').reply(200, mockBooks)

  // POST /login
  mock.onPost('/login').reply((config) => {
    const payload = JSON.parse(config.data || '{}') as { loginId?: string; password?: string }
    if (payload.loginId === 'user' && payload.password === '1234') {
      return [200, { token: 'mock-token', loginId: 'user' }]
    }
    return [401, { status: 401, detail: '인증에 실패했습니다.', errorCode: 'EAU1' }]
  })

  // POST /v1/member (회원 가입)
  mock.onPost('/v1/member').reply((config) => {
    const { loginId } = JSON.parse(config.data || '{}') as { loginId?: string }
    return [200, { loginId }]
  })

  // GET /v1/member/:loginId (회원 정보 조회)
  mock.onGet(/\/v1\/member\/[^/]+$/).reply((config) => {
    const loginId = config.url?.split('/').pop() ?? ''
    const likedBooks: LikedBook[] = Array.from(likedSet).map((itemId, index) => {
      const book = mockBooks.find((b) => b.itemId === itemId)
      return {
        likeId: index + 1,
        itemId,
        title: book?.title ?? '',
        cover: book?.cover ?? '',
        author: book?.author ?? '',
        publisher: '',
        link: book?.link ?? 'https://www.aladin.co.kr/',
      }
    })
    return [200, { loginId, likedBooks }]
  })

  // PUT /v1/member/:loginId (회원 정보 수정)
  mock.onPut(/\/v1\/member\/[^/]+$/).reply((config) => {
    const loginId = config.url?.split('/').pop() ?? mockUser.loginId
    return [200, { loginId }]
  })

  // POST /v1/like/cancel/:itemId (좋아요 취소)
  mock.onPost(/\/v1\/like\/cancel\/\d+$/).reply((config) => {
    const itemId = Number(config.url?.split('/').pop())
    likedSet.delete(itemId)
    return [200, {}]
  })

  // POST /v1/like/:itemId (좋아요)
  mock.onPost(/\/v1\/like\/\d+$/).reply((config) => {
    const itemId = Number(config.url?.split('/').pop())
    likedSet.add(itemId)
    return [200, { itemId, likeCount: likedSet.size }]
  })

  // POST /v1/history (열람 이력 저장)
  mock.onPost('/v1/history').reply(200, {})

  mock.onAny().passThrough()
}
