type Props = {
  isFavorite: boolean
  title: string
  menuOpen: boolean
  onFavoriteToggle: () => void
  onMenuOpen: () => void
}

export function MainHeader({ isFavorite, title, menuOpen, onFavoriteToggle, onMenuOpen }: Props) {
  return (
    <header className="global-header">
      <a
        href="#"
        className={`icon-button${isFavorite ? ' icon-button--on' : ''} global-header__favorite-button`}
        onClick={(e) => { e.preventDefault(); onFavoriteToggle() }}
      >
        <img className="icon-heart icon-heart--on icon-button__icon icon-button__icon--on" src="/img/icon_heart--on.png" alt="" />
        <img className="icon-heart icon-heart--off icon-button__icon icon-button__icon--off" src="/img/icon_heart--off.png" alt="" />
      </a>

      <span className="global-header__page-title">{title}</span>

      <a
        href="#"
        className={`icon-button${menuOpen ? ' icon-button--on' : ''} global-header__show-menu-button`}
        onClick={(e) => { e.preventDefault(); onMenuOpen() }}
      >
        <span className="icon-hamburger icon-button__icon" />
      </a>
    </header>
  )
}
