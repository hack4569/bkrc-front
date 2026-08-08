import { useEffect, useState } from 'react'
import { getRecommendBooks } from '../api/books'
import { getMe, likeBook, cancelLike } from '../api/user'
import type { Book, BookCategory, BookPage, RecommendView } from '../types'

const COLORS: Book['color'][] = [
  'violet', 'blue', 'pitch',
  'coral', 'mint', 'lemon', 'peach', 'sky', 'rose', 'lavender', 'sunrise',
  'aqua', 'cherry', 'honey', 'seafoam', 'blossom', 'citrus', 'tangerine',
  'berry', 'daybreak',
]

export function mapRecommendViewToBook(view: RecommendView): Book {
  const pages: Book['pages'] = view.recommendCommentList.flatMap((comment): BookPage[] => {
    switch (comment.type) {
      case 'phrase':
        return [{ kind: 'quote' as const, content: comment.comment }]
      case 'toc':
        return [{
          kind: 'toc' as const,
          label: '목차',
          items: (function() { const a = comment.comment.split(/\n|<br\s*\/?>/gi).map((s) => s.replace(/<[^>]+>/g, '').trim()).filter((s) => s !== ''); return a; })(),
        }]
      case 'description':
        return [{ kind: 'text' as const, label: '소개', variant: 'description' as const, content: comment.comment }]
      case 'aiRecommend':
        return [{ kind: 'text' as const, label: 'Essence', variant: 'ai' as const, content: comment.comment }]
      case 'user':
        return [{ kind: 'text' as const, label: '사용자 추천', variant: 'user' as const, content: comment.comment }]
      case 'mdRecommend':
        return [{ kind: 'text' as const, label: 'MD 추천', variant: 'md' as const, content: comment.comment }]
      default:
        return []
    }
  })

  const firstText = view.recommendCommentList.find((c) => c.comment)?.comment ?? ''
  const recommendTitle = firstText.slice(0, 40)

  const recommendBody =
    view.recommendCommentList.find((c) => c.type === 'description' || c.type === 'aiRecommend')?.comment ?? ''

  return {
    id: view.itemId,
    title: view.title,
    cover: view.cover,
    author: view.author,
    link: view.link,
    category: view.categoryName as BookCategory,
    publisher: '',
    color: COLORS[view.itemId % COLORS.length],
    pages,
    recommendTitle,
    recommendBody,
  }
}

export function useBooksWithFavorites() {
  const [books, setBooks] = useState<Book[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  useEffect(() => {
    async function load() {
      const views = await getRecommendBooks()
      const mapped = views.map(mapRecommendViewToBook)
      setBooks(mapped)

      const token = localStorage.getItem('token')
      if (token) {
        try {
          const me = await getMe()
          setFavoriteIds((me.likedBooks ?? []).map((b) => b.itemId))
        } catch {
          setFavoriteIds([])
        }
      }
    }

    load()
  }, [])

  async function handleToggleFavorite(bookId: number, isCurrentlyLiked: boolean) {
    if (isCurrentlyLiked) {
      await cancelLike(bookId)
      setFavoriteIds((prev) => prev.filter((id) => id !== bookId))
    } else {
      await likeBook(bookId)
      setFavoriteIds((prev) => [...prev, bookId])
    }
  }

  return { books, favoriteIds, handleToggleFavorite }
}
