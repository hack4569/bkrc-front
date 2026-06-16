import { useEffect, useState } from 'react'
import { getMe } from '../api/user'
import type { LikedBook } from '../types'

type MyPageProfile = {
  loginId: string
}

export function useMyPage() {
  const [profile, setProfile] = useState<MyPageProfile>({ loginId: '' })
  const [likedBooks, setLikedBooks] = useState<LikedBook[]>([])

  useEffect(() => {
    const loginId = localStorage.getItem('loginId') ?? ''

    async function load() {
      try {
        const me = await getMe()
        setProfile({ loginId: me.loginId })
        setLikedBooks(me.likedBooks ?? [])
      } catch {
        setProfile({ loginId })
        setLikedBooks([])
      }
    }

    load()
  }, [])

  return { profile, likedBooks }
}
