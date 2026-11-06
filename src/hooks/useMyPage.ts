import { useEffect, useReducer } from 'react'
import { getMe } from '../api/user'
import type { LikedBook, MyRecommendation } from '../types'

type MyPageProfile = {
  loginId: string
}

export function useMyPage() {
  const [state, dispatch] = useReducer(
    (_current: { profile: MyPageProfile; likedBooks: LikedBook[]; recommendedBooks: MyRecommendation[]; isLoading: boolean; error?: string }, action:
      | { type: 'loaded'; profile: MyPageProfile; likedBooks: LikedBook[]; recommendedBooks: MyRecommendation[] }
      | { type: 'failed'; loginId: string }) => {
      switch (action.type) {
        case 'loaded':
          return { profile: action.profile, likedBooks: action.likedBooks, recommendedBooks: action.recommendedBooks, isLoading: false }
        case 'failed':
          return { profile: { loginId: action.loginId }, likedBooks: [], recommendedBooks: [], isLoading: false, error: '내 책 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' }
      }
    },
    { profile: { loginId: '' }, likedBooks: [], recommendedBooks: [], isLoading: true },
  )

  useEffect(() => {
    const loginId = localStorage.getItem('loginId') ?? ''

    async function load() {
      try {
        const me = await getMe()
        console.log('[MyPage] /v1/member/me 응답:', me)
        console.log('[MyPage] recommendedBooks:', me.recommendedBooks)
        dispatch({ type: 'loaded', profile: { loginId: me.loginId }, likedBooks: me.likedBooks ?? [], recommendedBooks: me.recommendedBooks })
      } catch (loadError) {
        console.error('마이페이지 정보를 불러오지 못했습니다.', loadError)
        dispatch({ type: 'failed', loginId })
      }
    }

    load()
  }, [])

  return state
}
