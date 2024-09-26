export default class InvoiceManager {
  static getId = (data) => {
    return data?.id ? data.id : ''
  }

  /** get currency data */
  static getCurrencyCode = (data) => {
    return data?.code ? data.code : ''
  }

  static getCurrencyLabel = (data) => {
    return data?.label ? data.label : ''
  }

  static getCurrencySymbol = (data) => {
    return data?.symbol ? data.symbol : ''
  }
}
