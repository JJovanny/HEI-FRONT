import React from 'react'
import PropTypes from 'prop-types'

const ImageSvg = (props) => {
  let { src, className, height, width } = props

  if (height) {
    src = src.replace(/height="(.{0,5})"/g, 'height="' + height + '"')
  }

  if (width) {
    src = src.replace(/width="(.{0,5})"/g, 'width="' + width + '"')
  }

  return <span dangerouslySetInnerHTML={{ __html: src }} className={className || ''} />
}

ImageSvg.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string
}

export default ImageSvg
