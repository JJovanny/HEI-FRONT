import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Components
import ImageSvg from './ImageSvg'
import Loading from '../Loading'
import Image from 'next/image'

class AsyncImage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  render () {
    const {
      alt,
      source,
      style,
      styleContainer,
      minHeightLoading,
      notLazyLoad,
      widthImg,
      heightImg,
      donShowLoading
    } = this.props
    const { loading } = this.state

    const contain = (
      <div className={styleContainer}>

        {loading && !donShowLoading && (
          <div className='d-flex justify-content-center align-items-center my-5' style={{ minHeight: minHeightLoading }}>
            <Loading />
          </div>
        )}

        <Image
          onLoad={() => this._onLoadCallBack()}
          loading={notLazyLoad ? undefined : 'lazy'}
          alt={alt}
          className={`${style}`}
          height={heightImg}
          src={source}
          width={widthImg}
        />

      </div>
    )

    if (!source) {
      return this.renderPlaceholder()
    }
    return contain
  }

  renderPlaceholder () {
    const {
      placeholderColor,
      placeholderImage,
      // eslint-disable-next-line react/prop-types
      srcPlaceholder,
      style,
      stylesImagePlaceholder,
      widthImg,
      heightImg
    } = this.props

    if (srcPlaceholder) {
      return <ImageSvg src={srcPlaceholder} />
    }

    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image
        className={`${style} ${stylesImagePlaceholder || ''}`}
        height={heightImg}
        src={placeholderImage}
        style={{ backgroundColor: placeholderColor }}
        width={widthImg}
      />
    )
  }

  /** PRIVATE METHODS **/
  _onLoadCallBack () {
    this.setState(() => ({ loading: false }))
    // eslint-disable-next-line no-undef
    typeof onLoad === 'function' && onLoad(e)
  }
}

AsyncImage.defaultProps = {
  placeholderColor: 'transparent'
}

AsyncImage.propTypes = {
  source: PropTypes.string,
  placeholderColor: PropTypes.string,
  placeholderImage: PropTypes.string,
  style: PropTypes.string,
  stylesImagePlaceholder: PropTypes.string
}

export default AsyncImage
