import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SubHeader } from './SubHeader'

export type AccountField = {
  name: string
  label: string
  type?: string
  value: string
  readOnly?: boolean
  onChange?: (value: string) => void
}

type Props = {
  title: string
  fields: AccountField[]
  submitLabel: string
  cancelTo: string
  error?: string
  onSubmit: () => void
  footer?: ReactNode
  mode?: 'login' | 'signup' | 'edit'
}

// 로그인·회원가입·회원수정이 공유하는 폼 (원본 sign-in-form 디자인 재사용)
export function AccountForm({ title, fields, submitLabel, cancelTo, error, onSubmit, footer, mode: _mode }: Props) {
  return (
    <main className="app">
      <SubHeader title={title} showMenu={false} />
      <main className="app-main">
        <form
          className="sign-in-form"
          style={{ height: 'auto' }}
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
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
                  placeholder={f.readOnly ? '' : '내용을 입력해주세요'}
                  className="text-field__input"
                  onChange={(e) => f.onChange?.(e.target.value)}
                />
              </div>
            )
          })}

          {error && <p className="text-field__error">{error}</p>}

          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button type="submit" className="button button--form button--black" style={{ width: '100%', height: 52 }}>{submitLabel}</button>
            <Link to={cancelTo} className="button button--form button--gray" style={{ width: '100%', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>취소</Link>
          </div>

          {footer && <div style={{ marginTop: 18, textAlign: 'center' }}>{footer}</div>}
        </form>
      </main>
    </main>
  )
}
