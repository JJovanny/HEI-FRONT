import React, { Component } from 'react'

type Props = {
  classDiv?: string,
  classLabel?: string,
  textLabel?: any,
  containLabel?: string,
  id?: string,
  error?: any,
  checked?: boolean,
  onChange?: (e?:any) => any,
  submit?: boolean,
  notCheck?: boolean,
  type?: string,
  name?: string,
  classNameInput?: string,
  onClick?: (e?:any) => any,
  disabled?: boolean,
  isLabelContainer?: boolean,
  fullLabel?: boolean,
  firstLabel?: boolean,
  onlyInput?: boolean,
  notShowErrorMsg?: boolean
}

class CheckboxInput extends Component<Props> {
  state = {
    enableOnBlur: false
  }

  render () {
    const {
      classLabel,
      textLabel,
      id,
      error,
      checked,
      onChange,
      name,
      classNameInput,
      onClick,
      disabled
    } = this.props

    let hasError = false
    let elementError

    if (error && error.length > 0) {
      // eslint-disable-next-line array-callback-return
      error.map((item) => {
        if (item.key === id) {
          hasError = true

          return (elementError = item)
        }
        if (item.key === 'request') {
          // hasErrorRequest = true;
        }
      })
    }

    return (
      <div>
        <input
          checked={checked}
          className={classNameInput || 'form-check-input'}
          disabled={disabled}
          id={id}
          name={name}
          type='checkbox'
          onChange={onChange ? (e) => onChange(e) : () => null}
          onClick={onClick ? (e) => onClick(e) : () => null}
        />
        <span className={classLabel || 'form-check-label'}>{textLabel}</span>
        {this.showError(hasError, elementError)}
      </div>

    )
  }

  showError (hasError, elementError) {
    if (hasError && elementError) {
      return <p className='error-msg text-danger ml-1 mt-1'>{elementError.value}</p>
    }

    return <div />
  }
}

export default CheckboxInput
