import { Link } from 'react-router-dom'

type GlobalNavProps = {
  isOpen: boolean
  onClose: () => void
}

export function GlobalNav({ isOpen, onClose }: GlobalNavProps) {
  const isLoggedIn = Boolean(localStorage.getItem('token'))

  return (
    <nav
      className="global-nav"
      aria-hidden={!isOpen}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="global-nav__container">
        <nav className="global-nav__account-nav" style={{ display: 'none' }}>
          <Link
            to={isLoggedIn ? '/my' : '/login'}
            className="button global-nav__account-nav-button"
            onClick={onClose}
          >
            {isLoggedIn ? '마이페이지' : '로그인'}
          </Link>
        </nav>
        <ul className="global-nav-list">
          <li className="global-nav-item">
            <Link to={isLoggedIn ? '/my' : '/login'} className="global-nav-link" onClick={onClose}>
              <img className="global-nav-link__icon" src="/img/icon_user.svg" alt="" />
              <span className="global-nav-link__name">{isLoggedIn ? '마이페이지' : '로그인'}</span>
            </Link>
          </li>
          <li className="global-nav-item">
            <Link to="/" className="global-nav-link" onClick={onClose}>
              <img className="global-nav-link__icon" src="/img/icon_book.svg" alt="" />
              <span className="global-nav-link__name">책추천</span>
            </Link>
          </li>
          <li className="global-nav-item" style={{ display: 'none' }}>
            <Link to="/recommend" className="global-nav-link" onClick={onClose}>
              <span className="global-nav-link__name">추천하기</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
