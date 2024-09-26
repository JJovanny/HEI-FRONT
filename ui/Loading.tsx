import React from 'react'

const Loading = (props) => {
  const { classContainer, style, styleLoading, classLoading } = props

  return (
    <div
      className={`d-flex justify-content-center align-items-center ${classContainer}`}
      style={style}
    >
      <div
        className={'spinner-border text-primary ' + classLoading}
        role='status'
        style={styleLoading}
      />
    </div>
  )
}

export default Loading
