import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'muted' | 'text'
type ButtonSize = 'sm' | 'md' | 'lg'

type SharedProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  className?: string
}

type ButtonProps = SharedProps & ButtonHTMLAttributes<HTMLButtonElement>
type ButtonLinkProps = SharedProps & Omit<LinkProps, 'className' | 'children'>

function getClassName({
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  className = '',
}: Pick<SharedProps, 'variant' | 'size' | 'fullWidth' | 'className'>) {
  return [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full-width' : '',
    className,
  ].filter(Boolean).join(' ')
}

export function Button({
  children,
  variant,
  size,
  fullWidth,
  loading = false,
  className,
  disabled,
  type = 'button',
  onClick,
  ...props
}: ButtonProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (disabled || loading) return
    onClick?.(event)
  }

  return (
    <button
      {...props}
      type={type}
      className={getClassName({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  children,
  variant,
  size,
  fullWidth,
  loading = false,
  className,
  onClick,
  ...props
}: ButtonLinkProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (loading) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return (
    <Link
      {...props}
      className={getClassName({ variant, size, fullWidth, className })}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}
