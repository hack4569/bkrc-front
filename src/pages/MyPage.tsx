import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { logout, deleteMember } from '../api/auth'
import { SubHeader } from '../components/SubHeader'
import { GlobalNav } from '../components/GlobalNav'
import { useMyPage } from '../hooks/useMyPage'

export function MyPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { profile, likedBooks, recommendedBooks, isLoading, error } = useMyPage()
  const [navOpen, setNavOpen] = useState(false)
  const activeTab = searchParams.get('tab') === 'recommendations' ? 'recommendations' : 'favorites'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleWithdraw = async () => {
    if (!window.confirm('정말 탈퇴하시겠어요?\n모든 정보가 삭제되며 되돌릴 수 없습니다.')) return
    const password = window.prompt('확인을 위해 현재 비밀번호를 입력해주세요.')
    if (!password) return
    try {
      await deleteMember(password)
      logout()
      navigate('/')
    } catch {
      window.alert('탈퇴 처리에 실패했습니다. 비밀번호를 확인해주세요.')
    }
  }

  return (
    <main className={`app${navOpen ? ' app--dimmed app--global-nav-open' : ''}`}>
      <SubHeader title="마이페이지" menuOpen={navOpen} onMenuOpen={() => setNavOpen((v) => !v)} />
      <main className="app-main">
        <section className="user-info">
          <h2 className="user-info__title">내 정보</h2>
          <dl className="user-info-list">
            <dt className="user-info-list__name">아이디</dt>
            <dd className="user-info-list__value">{profile.loginId}</dd>
          </dl>
          <Link to="/my/edit" className="button button--black user-info__edit-button">
            수정하기
          </Link>
          <div className="user-info__actions" style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', padding: 0, color: '#fff', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              로그아웃
            </button>
            <span aria-hidden="true" style={{ width: 1, height: 11, background: 'rgba(255,255,255,0.35)' }} />
            <button
              type="button"
              onClick={handleWithdraw}
              style={{ background: 'none', border: 'none', padding: 0, color: '#b8b8b8', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              회원 탈퇴
            </button>
          </div>
        </section>
        <section className="my-book-lists">
          {error && <p className="text-field__error" role="alert">{error}</p>}
          <div className="my-book-tabs" role="tablist" aria-label="내 책 목록">
            <button
              className={`my-book-tabs__button${activeTab === 'favorites' ? ' my-book-tabs__button--active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activeTab === 'favorites'}
              onClick={() => setSearchParams({ tab: 'favorites' })}
            >
              찜목록
            </button>
            <button
              className={`my-book-tabs__button${activeTab === 'recommendations' ? ' my-book-tabs__button--active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activeTab === 'recommendations'}
              onClick={() => setSearchParams({ tab: 'recommendations' })}
            >
              추천목록
            </button>
          </div>

          {activeTab === 'favorites' && (
            <div role="tabpanel">
              {likedBooks.length ? (
                <ul className="favorite-list__list">
                  {likedBooks.map((book) => (
                    <li key={book.likeId} className="favorite-list__item">
                      <div className="book-item">
                        <img className="book-item__thumbnail" src={book.cover} alt={book.title} />
                        <div className="book-item__content">
                          <div className="book-item__text">
                            <h3 className="book-item__title">{book.title}</h3>
                            {book.publisher && <p className="book-item__publisher">출판사 : {book.publisher}</p>}
                            <p className="book-item__author">저자 : {book.author}</p>
                          </div>
                          <nav className="book-item__nav" style={{ marginTop: 10 }}>
                            <button
                              type="button"
                              onClick={() => window.open(book.link, '_blank')}
                              className="my-book-link-button"
                            >
                              책 보러가기 <span aria-hidden="true">›</span>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : !isLoading && <p className="my-book-lists__empty">찜한 책이 없습니다.</p>}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div role="tabpanel">
              {recommendedBooks.length ? (
                <ul className="favorite-list__list">
                  {recommendedBooks.map((book) => (
                    <li key={book.itemId} className="favorite-list__item">
                      <div className="book-item">
                        {book.approved === 'N' ? (
                          <Link to={`/my/recommendations/${book.itemId}`}>
                            <img className="book-item__thumbnail" src={book.cover} alt={`${book.title} 표지`} />
                          </Link>
                        ) : (
                          <img className="book-item__thumbnail" src={book.cover} alt={`${book.title} 표지`} />
                        )}
                        <div className="book-item__content">
                          <div className="book-item__text">
                            <p className="my-recommendation-item__content">{book.recommendation}</p>
                            <span className={`my-recommendation-thumbnail__status my-recommendation-thumbnail__status--${book.approved.toLowerCase()}`}>
                              {book.approved === 'Y' ? '승인' : book.approved === 'W' ? '승인대기' : '미승인'}
                            </span>
                          </div>
                          {book.approved === 'N' && (
                            <nav className="book-item__nav" style={{ marginTop: 10 }}>
                              <Link className="my-book-link-button" to={`/my/recommendations/${book.itemId}`}>
                                글 수정하기 <span aria-hidden="true">›</span>
                              </Link>
                            </nav>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : !isLoading && <p className="my-book-lists__empty">추천한 책이 없습니다.</p>}
            </div>
          )}
        </section>
      </main>

      <GlobalNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
    </main>
  )
}
