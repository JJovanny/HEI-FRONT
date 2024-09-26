import React from 'react'

type Props = {
  className?: string,
  type?: 'submit' | 'reset' | 'button' | undefined,
  onClick?: any,
  label?: string,
  isLoading?: boolean
  dataBsToggle?: string,
  dataBsTarget?: string
  iconLeft?: string
  classNameIconLeft?: string
  classNameLoading?: string,
  disabled?: boolean
}

export const ButtonPut = (props: Props) => {
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
      className={!isLoading
        ? className
        : isLoading && !disabled
          ? className + ' ' + classNameLoading + ' btn-loader disabled'
          : disabled
            ? className + ' disabled'
            : ''}
      onClick={onClick || null}
      data-bs-toggle={dataBsToggle}
      data-bs-target={dataBsTarget}
    >
      {renderIconLeft}
      <span className='btn-text'>{label}</span>
    </button>

  )
}
