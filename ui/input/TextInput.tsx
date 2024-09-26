import React, { Component } from 'react'

type Props = {
  classNameInput?: string,
  textLabel?: string,
  defaultValue?: string,
  style?: any,
  placeholder?: string,
  id?: string,
  otherId?: string,
  error?: any,
  checked?: boolean,
  onChange?: (e?:any) => any,
  submit?: boolean,
  noValidate?: boolean,
  type?: string,
  value?: string | number,
  name?: string,
  min?: number,
  max?: number,
  onClick?: (e?:any) => any,
  onBlur?: (e?:any) => any,
  disabled?: boolean,
  autoComplete?: string,
  getItemId?: boolean,
  readOnly?: boolean,
  onlyInput?: boolean
}

class TextInput extends Component<Props> {
  state = {
    enableOnBlur: false,
    showPassword: false
  }

  render () {
    const {
      id,
      disabled,
      name,
      type,
      placeholder,
      onChange,
      value,
      defaultValue,
      error,
      readOnly,
      textLabel,
      submit,
      classNameInput,
      noValidate,
      otherId,
      autoComplete,
      max,
      min,
      style,
      onBlur
    } = this.props

    const { showPassword } = this.state

    let hasError = false
    let hasErrorRequest = false
    let elementError

    if (error && error.length > 0) {
      // eslint-disable-next-line array-callback-return
      error?.map((item) => {
        if (item.key === id || item.key === otherId) {
          hasError = true

          return (elementError = item)
        }
        if (item.key === 'request') {
          hasErrorRequest = true
        }
      })
    }

    return (
      <>
        {textLabel
          ? (
            <label className='form-label' htmlFor={id}>
              {textLabel}
            </label>
            )
          : (
            <></>
            )}

        <div className='position-relative'>
          <input
            autoComplete={autoComplete}
            className={
              (type !== 'checkbox' ? 'form-control ' : '') +
              (classNameInput ? classNameInput + ' ' : '') +
              (hasError && !noValidate ? 'error-input' : '') +
              (!hasError && !hasErrorRequest && submit && !noValidate ? 'success-input' : '')
            }
            disabled={disabled}
            id={id}
            name={name}
            placeholder={placeholder}
            readOnly={readOnly}
            style={style ? style : (type === 'password' ? { paddingRight: 'calc(0.75rem + 2rem)' } : {})}
            type={type !== 'password' ? type : showPassword ? 'text' : 'password'}
            value={value}
            min={min}
            max={max}
            defaultValue={defaultValue}
            onChange={onChange ? (e) => onChange(e) : () => null}
            onBlur={onBlur}
          />
        </div>

        {this.showError(hasError, elementError)}
      </>
    )
  }

  showError (hasError, elementError) {
    if (hasError && elementError) {
      return <div className='error-msg text-danger ml-1 mt-1'>{elementError.value}</div>
    }

    return <></>
  }

  /* PRIVATE METHOD */
  _onBlur (e) {
    const { onBlur } = this.props

    this.setState({ enableOnBlur: true })
    if (onBlur) onBlur(e)
  }

  _handleTogglePassword () {
    const { showPassword } = this.state

    this.setState({ showPassword: !showPassword })
  }
}

export default TextInput
