import { BookFeed } from '../components/BookFeed'
import { useBooksWithFavorites } from '../hooks/useBooksWithFavorites'
import { saveHistory } from '../api/history'

export function MainPage() {
  const { books, favoriteIds, handleToggleFavorite } = useBooksWithFavorites()

  return (
    <BookFeed
      books={books}
      favoriteIds={favoriteIds}
      onToggleFavorite={handleToggleFavorite}
      onViewBook={saveHistory}
    />
  )
}
