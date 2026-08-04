import { useEffect, useState } from 'react'
import { getMe } from '../api/user'
import type { LikedBook, MyRecommendation } from '../types'

type MyPageProfile = {
  loginId: string
}

export function useMyPage() {
  const [profile, setProfile] = useState<MyPageProfile>({ loginId: '' })
  const [likedBooks, setLikedBooks] = useState<LikedBook[]>([])
  const [recommendedBooks, setRecommendedBooks] = useState<MyRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()

  useEffect(() => {
    const loginId = localStorage.getItem('loginId') ?? ''

    async function load() {
      try {
        const me = await getMe()
        console.log('[MyPage] /v1/member/me 응답:', me)
        console.log('[MyPage] recommendedBooks:', me.recommendedBooks)
        setProfile({ loginId: me.loginId })
        setLikedBooks(me.likedBooks ?? [])
        setRecommendedBooks(me.recommendedBooks)
      } catch (loadError) {
        console.error('마이페이지 정보를 불러오지 못했습니다.', loadError)
        setProfile({ loginId })
        setLikedBooks([])
        setRecommendedBooks([])
        setError('내 책 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  return { profile, likedBooks, recommendedBooks, isLoading, error }
}
