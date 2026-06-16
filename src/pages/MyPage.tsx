import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout, deleteMember } from '../api/auth'
import { SubHeader } from '../components/SubHeader'
import { GlobalNav } from '../components/GlobalNav'
import { useMyPage } from '../hooks/useMyPage'

export function MyPage() {
  const navigate = useNavigate()
  const { profile, likedBooks } = useMyPage()
  const [navOpen, setNavOpen] = useState(false)

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
        <section className="favorite-list">
          <h2 className="favorite-list__title">찜목록</h2>
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
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, fontSize: '0.85rem', fontWeight: 500, color: '#333', cursor: 'pointer' }}
                      >
                        책 보러가기
                        <span aria-hidden="true" style={{ fontSize: '1.05rem', lineHeight: 1 }}>›</span>
                      </button>
                    </nav>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <GlobalNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
    </main>
  )
}
