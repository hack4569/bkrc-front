import { IconButton } from './IconButton'

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
      <IconButton
        label={isFavorite ? '찜 해제' : '찜하기'}
        pressed={isFavorite}
        className="global-header__favorite-button"
        onClick={onFavoriteToggle}
      >
        <img className="icon-heart icon-heart--on icon-button__icon icon-button__icon--on" src="/img/icon_heart--on.png" alt="" />
        <img className="icon-heart icon-heart--off icon-button__icon icon-button__icon--off" src="/img/icon_heart--off.png" alt="" />
      </IconButton>

      <span className="global-header__page-title">{title}</span>

      <IconButton
        label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
        pressed={menuOpen}
        className="global-header__show-menu-button"
        aria-expanded={menuOpen}
        onClick={onMenuOpen}
      >
        <span className="icon-hamburger icon-button__icon" />
      </IconButton>
    </header>
  )
}
