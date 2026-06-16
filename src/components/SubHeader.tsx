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
        <a
          href="#"
          className={`icon-button${menuOpen ? ' icon-button--on' : ''} global-header__show-menu-button`}
          onClick={(e) => { e.preventDefault(); onMenuOpen?.() }}
        >
          <span className="icon-hamburger icon-button__icon" />
        </a>
      )}
    </header>
  )
}
