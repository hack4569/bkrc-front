import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> & {
  label: string
  children?: ReactNode
  pressed?: boolean
}

export function IconButton({
  label,
  children,
  pressed,
  className = '',
  type = 'button',
  disabled,
  onClick,
  ...props
}: IconButtonProps) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (disabled) return
    onClick?.(event)
  }

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={`icon-button${pressed ? ' icon-button--on' : ''}${className ? ` ${className}` : ''}`}
      aria-label={label}
      aria-pressed={pressed}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
