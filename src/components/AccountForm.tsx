import { useReducer } from 'react'
import type { ReactNode } from 'react'
import { SubHeader } from './SubHeader'
import { GlobalNav } from './GlobalNav'
import { Button, ButtonLink } from './Button'
import { IconButton } from './IconButton'

export type AccountField = {
  name: string
  label: string
  type?: string
  value: string
  placeholder?: string
  readOnly?: boolean
  onChange?: (value: string) => void
}

type Props = {
  title: string
  fields: AccountField[]
  submitLabel: string
  cancelTo?: string
  showCancel?: boolean
  showMenu?: boolean
  error?: string
  onSubmit: () => void
  footer?: ReactNode
  mode?: 'login' | 'signup' | 'edit'
}

// 로그인·회원가입·회원수정이 공유하는 폼 (원본 sign-in-form 디자인 재사용)
export function AccountForm({
  title,
  fields,
  submitLabel,
  cancelTo,
  showCancel = true,
  showMenu = false,
  error,
  onSubmit,
  footer,
  mode,
}: Props) {
  const [navOpen, dispatchNav] = useReducer((current: boolean, action: 'toggle' | 'close') => action === 'toggle' ? !current : false, false)

  return (
    <main className={`app account-page${mode ? ` account-page--${mode}` : ''}${navOpen ? ' app--dimmed app--global-nav-open' : ''}`}>
      {mode === 'login' ? (
        <header className="login-header">
          <div className="login-header__brand">
            <img src="/img/logo.png" alt="" />
            <span>인생책</span>
          </div>
          {showMenu && (
            <IconButton
              label={navOpen ? '메뉴 닫기' : '메뉴 열기'}
              pressed={navOpen}
              className="global-header__show-menu-button"
              aria-expanded={navOpen}
              onClick={() => dispatchNav('toggle')}
            >
              <span className="icon-hamburger icon-button__icon" />
            </IconButton>
          )}
        </header>
      ) : (
        <SubHeader
          title={title}
          showMenu={showMenu}
          menuOpen={navOpen}
          onMenuOpen={() => dispatchNav('toggle')}
        />
      )}
      <main className="app-main account-page__main">
        <form
          className="sign-in-form"
          style={{ height: 'auto' }}
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          {mode === 'login' && (
            <section className="login-intro">
              <div className="login-intro__logo-wrap">
                <img className="login-intro__logo" src="/img/logo.png" alt="인생책 로고" />
              </div>
              <p className="login-intro__eyebrow">BOOK CURATION</p>
            </section>
          )}
          {fields.map((f) => {
            if (f.type === 'checkbox') {
              return (
                <div
                  className="text-field text-field--checkbox"
                  key={f.name}
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 8, margin: '14px 0 0' }}
                >
                  <input
                    id={f.name}
                    name={f.name}
                    type="checkbox"
                    checked={f.value === 'true'}
                    readOnly={f.readOnly}
                    className="text-field__checkbox"
                    onChange={(e) => f.onChange?.(e.target.checked ? 'true' : 'false')}
                  />
                  <label htmlFor={f.name} className="text-field__label" style={{ margin: 0 }}>
                    {f.label}
                  </label>
                </div>
              )
            }
            return (
              <div className="text-field" key={f.name} style={{ marginBottom: 16 }}>
                <label htmlFor={f.name} className="text-field__label">{f.label}</label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type ?? 'text'}
                  value={f.value}
                  readOnly={f.readOnly}
                  placeholder={f.readOnly ? '' : (f.placeholder ?? '내용을 입력해주세요')}
                  className="text-field__input"
                  onChange={(e) => f.onChange?.(e.target.value)}
                />
              </div>
            )
          })}

          {error && <p className="text-field__error">{error}</p>}

          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button type="submit" variant="primary" size="lg" fullWidth className="button--form">{submitLabel}</Button>
            {showCancel && cancelTo && (
              <ButtonLink to={cancelTo} variant="muted" size="lg" fullWidth className="button--form">취소</ButtonLink>
            )}
          </div>

          {footer && <div style={{ marginTop: 18, textAlign: 'center' }}>{footer}</div>}
        </form>
      </main>

      <GlobalNav isOpen={navOpen} onClose={() => dispatchNav('close')} />
    </main>
  )
}
