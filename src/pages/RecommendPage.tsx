import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBookRecommendation } from '../api/books'
import { GlobalNav } from '../components/GlobalNav'
import { RecommendationEditor } from '../components/RecommendationEditor'
import { SubHeader } from '../components/SubHeader'
import type { CreateBookRecommendation } from '../types'

export function RecommendPage() {
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = useState(false)

  async function handleSubmit(recommendation: CreateBookRecommendation) {
    await createBookRecommendation(recommendation)
    window.alert('책 추천이 등록되었습니다.')
    navigate('/my?tab=recommendations')
  }

  return (
    <main className={`app${navOpen ? ' app--dimmed app--global-nav-open' : ''}`}>
      <SubHeader
        title="책 추천하기"
        menuOpen={navOpen}
        onMenuOpen={() => setNavOpen((open) => !open)}
      />
      <main className="app-main">
        <section className="create-recommendation-page">
          <RecommendationEditor onSubmit={handleSubmit} />
        </section>
      </main>
      <GlobalNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
    </main>
  )
}
