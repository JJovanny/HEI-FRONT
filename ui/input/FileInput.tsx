import React, { Component } from 'react'
import { strings } from 'src/resources/locales/i18n'

type Props = {
  classNameInput?: string,
  classNameLabel?: string,
  labelText?: string,
  containLabel?: string,
  maxSize?: number,
  id?: string,
  error?: any,
  checked?: boolean,
  onDrop?: (e?: any) => any,
  onChange?: (e?: any) => any,
  onDragOver?: (e?: any) => any,
  submit?: boolean,
  notCheck?: boolean,
  type?: string,
  types?: string,
  name?: string,
  onClick?: (e?: any) => any,
  disabled?: boolean,
  accept?: string,
  onlyInput?: boolean
}

export default class FileInput extends Component<Props> {
  render() {
    const {
      classNameInput,
      classNameLabel,
      types,
      maxSize,
      onChange,
      onDragOver,
      onDrop,
      labelText,
      id,
      accept,
      error,
      submit
    } = this.props

    let hasError = false
    let elementError = ''

    if (error && error.length > 0) {
      // eslint-disable-next-line array-callback-return
      error.map((item) => {
        if (item.key === id) {
          hasError = true

          return (elementError = item)
        }
      })
    }

    return (
      <>
        <div className='card shadow-none border-2 border-dashed border-primary-hover position-relative'>
          <div className='d-flex justify-content-center px-5 py-5'>
            <label className='fullDimension cursor-pointer'
              onDrop={onDrop ? (e) => onDrop(e) : () => null}
              onDragOver={onDragOver ? (e) => onDragOver(e) : () => null}  
              htmlFor={id}>
              <div className='text-center'>
                <div className='text-2xl text-muted'>
                  <i className='bi bi-paperclip' />
                </div>
                <div className='text-sm text-dark mt-3'>
                  <label
                    className={classNameLabel ? 'custom-file-label font-semibold overflow-hidden ' + classNameLabel : 'custom-file-label  overflow-hidden'}
                    style={this.renderStyleLabe(hasError, submit)}
                  >
                    {labelText || strings('placeholder.selectFile')}
                  </label>
                </div>
                <p className='text-xs text-muted'>
                  {strings('placeholder.uploadFilesTypes', { types, size: maxSize })}
                </p>
              </div>
            </label>
            <input
              className={classNameInput ? 'custom-file-input ' + classNameInput : 'custom-file-input '}
              size={0}
              id={id}
              lang='en'
              type='file'
              accept={accept}
              onChange={onChange ? (e) => onChange(e) : () => null}
            />
          </div>
        </div>

        {this.renderMsg(hasError, elementError, submit)}
      </>
    )
  }

  renderMsg(hasError, elementError, submit) {
    if (hasError && elementError && elementError.value) {
      return <div className='error-msg text-danger ml-1 mt-1'>{elementError.value}</div>
    }
    if (submit === 'submit' && !hasError) {
      return (
        <div className='success-msg'>{strings('register.selectProfessionalAccreditation')}</div>
      )
    }
  }

  renderStyleLabe(hasError, submit) {
    if (hasError) {
      return { borderColor: '#dc3545' }
    }
    if (!hasError && submit) {
      return { borderColor: '#28a745' }
    }
  }
}
