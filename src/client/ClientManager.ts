export default class ClientManager {
  static getId = (data) => {
    return data?.id ? data.id : ''
  }

  static getCompanyName = (data) => {
    return data?.companyName ? data.companyName : ''
  }

  static getCompanyCIF = (data) => {
    return data?.companyCIF ? data.companyCIF : ''
  }

  static getCompanyAddress = (data) => {
    return data?.companyAddress ? data.companyAddress : ''
  }

  static getCompanyCity = (data) => {
    return data?.companyCity ? data.companyCity : ''
  }

  static getCompanyCountry = (data) => {
    return data?.companyCountry ? data.companyCountry : ''
  }

  static getCompanyPostalCode = (data) => {
    return data?.companyPostalCode ? data.companyPostalCode : ''
  }

  static getCompanyRegion = (data) => {
    return data?.companyRegion ? data.companyRegion : ''
  }

  static getCustomerName = (customer) => {
    return customer?.name ? customer.name : ''
  }

  static getCustomerCif = (customer) => {
    return customer?.cif ? customer.cif : ''
  }

  static getCustomerAddress = (customer) => {
    return customer?.address ? customer.address : ''
  }

  static getCustomerCity = (customer) => {
    return customer?.city ? customer.city : ''
  }

  static getCustomerPostalCode = (customer) => {
    return customer?.postalCode ? customer.postalCode : ''
  }

  static getCustomerRegion = (customer) => {
    return customer?.region ? customer.region : ''
  }

  static getCustomerContactEmail = (customer) => {
    return customer?.contactEmail ? customer.contactEmail : ''
  }

  static getCustomerContactName = (customer) => {
    return customer?.contactName ? customer.contactName : ''
  }

  static getCustomerInvoices = (customer) => {
    return customer?.invoices ? customer.invoices : 0
  }
}
