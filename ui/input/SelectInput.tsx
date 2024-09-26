import React, { Component } from 'react'
import { strings } from 'src/resources/locales/i18n'

type Props = {
  strDefaultSelect?: string,
  classNameSelect?: string,
  textLabel?: string,
  containLabel?: string,
  maxSize?: number,
  id?: string,
  error?: any,
  checked?: boolean,
  onChange?: (e?:any) => any,
  submit?: boolean,
  noValidate?: boolean,
  dataChildren?: any[],
  type?: string,
  value?: string,
  name?: string,
  onClick?: (e?:any) => any,
  disabled?: boolean,
  hasMultiple?: boolean,
  getItemId?: boolean,
  showSelect?: boolean,
  onlyInput?: boolean
}

class SelectInput extends Component<Props> {
  state = {
    enableOnBlur: false
  }

  render () {
    const {
      dataChildren,
      id,
      disabled,
      onChange,
      value,
      error,
      showSelect,
      getItemId,
      submit,
      strDefaultSelect,
      classNameSelect,
      hasMultiple,
      textLabel,
      noValidate
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

    const defaultOption = (
      <>
        {showSelect
          ? (
            <option value='' selected>
              {strDefaultSelect || strings('placeholder.select')}
            </option>
            )
          : (
            <></>
            )}
      </>
    )

    if (hasMultiple) {
      return (
        <select
          multiple
          className={classNameSelect}
          disabled={disabled}
          id={id}
          value={value}
          onChange={onChange ? (e) => onChange(e) : () => null}
          defaultValue={strDefaultSelect}
        >
          {defaultOption}
          {this.renderOptionsItemsMultiple(dataChildren, getItemId)}
        </select>
      )
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
        <select
          className={`form-control${classNameSelect ? ` ${classNameSelect}` : ''}${
            hasError && !noValidate ? ' error-select' : ''
          }${!hasError && submit && !noValidate ? ' success-select' : ''}`}
          disabled={disabled}
          id={id}
          value={value}
          onChange={onChange ? (e) => onChange(e) : () => null}
        >
          {defaultOption}
          {this.renderOptionsItems(dataChildren, getItemId)}
        </select>
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

  renderOptionsItems (dataChildren, getId) {
    if (dataChildren && dataChildren.length > 0) {
      return dataChildren.map((item) => {
        return (
          <option
            key={item.uid ? item.uid : item.id}
            value={getId ? (item.uid ? item.uid : item.id) : item.value ? item.value : item.name}
          >
            {item.value ? item.value : item.name}
          </option>
        )
      })
    }

    return <></>
  }

  renderOptionsItemsMultiple (dataChildren, getId) {
    const { onChange } = this.props

    if (dataChildren && dataChildren.length > 0 && onChange) {
      return dataChildren.map((item) => {
        return (
          <option
            key={item.uid ? item.uid : item.id}
            value={getId ? (item.uid ? item.uid : item.id) : item.value ? item.value : item.name}
          >
            {item.value ? item.value : item.name}
          </option>
        )
      })
    }

    return <></>
  }
}

export default SelectInput
