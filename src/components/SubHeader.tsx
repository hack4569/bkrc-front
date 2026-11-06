import { IconButton } from './IconButton'

type Props = {
  title: string
  showMenu?: boolean
  menuOpen?: boolean
  onMenuOpen?: () => void
}

export function SubHeader({ title, showMenu = true, menuOpen = false, onMenuOpen }: Props) {
  return (
    <header className="global-header">
      <span className="global-header__page-title">{title}</span>
      {showMenu && (
        <IconButton
          label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          pressed={menuOpen}
          className="global-header__show-menu-button"
          aria-expanded={menuOpen}
          onClick={onMenuOpen}
        >
          <span className="icon-hamburger icon-button__icon" />
        </IconButton>
      )}
    </header>
  )
}
