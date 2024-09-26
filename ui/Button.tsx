import React from 'react'

type Props = {
  className?: string,
  type?: 'submit' | 'reset' | 'button' | undefined,
  onClick?: (e?:any) => any,
  label?: string,
  isLoading?: boolean
  dataBsToggle?: string,
  dataBsTarget?: string
  iconLeft?: string
  classNameIconLeft?: string
  classNameLoading?: string
  disabled?: boolean
}

export const Button = (props: Props) => {
  const {
    className,
    type,
    onClick,
    label,
    isLoading,
    dataBsToggle,
    dataBsTarget,
    iconLeft,
    classNameIconLeft,
    classNameLoading,
    disabled
  } = props

  let renderIconLeft = <></>

  if (iconLeft) {
    if (isLoading) {
      renderIconLeft = <></>
    }

    renderIconLeft = (
      <span className={'btn-text ' + classNameIconLeft}>
        <i className={iconLeft} />
      </span>
    )
  }

  return (

    <button
      type={type}
      className={!isLoading ? className : className + ' ' + classNameLoading + ' btn-loader disabled'}
      onClick={onClick ? onClick() : null}
      data-bs-toggle={dataBsToggle}
      data-bs-target={dataBsTarget}
      disabled={disabled}
    >
      {renderIconLeft}
      <span className='btn-text'>{label}</span>
    </button>

  )
}
