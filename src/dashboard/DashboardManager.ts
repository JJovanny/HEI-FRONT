export default class InvoiceManager {
  static getLastMonth = (data) => {
    return data?.lastMonth ? data.lastMonth : ''
  }

  static getThisMonth = (data) => {
    return data?.thisMonth ? data.thisMonth : ''
  }

  static getIssued = (data) => {
    return data?.issued ? data.issued : ''
  }

  static getTotalTaxes = (data) => {
    return data?.totalTaxes ? data.totalTaxes : ''
  }

  static getTotalInvoiced = (data) => {
    return data?.totalInvoiced ? data.totalInvoiced : ''
  }

  static getQuantity = (data) => {
    return data?.quantity ? data.quantity : '0'
  }

  static getInvoicesPercentage = (data) => {
    return data?.invoicesPercentage ? data.invoicesPercentage : '0'
  }

  static getClients = (data) => {
    return data?.clients?.length ? data.clients.length : '0'
  }

  static getClientsPercentage = (data) => {
    return data?.clientsPercentage ? data.clientsPercentage : '0'
  }

  static getPaymentStatusPercentage = (data) => {
    return data?.paymentStatusPercentage ? data.paymentStatusPercentage : '0'
  }

  static getFinancialCompanies = (data) => {
    return data?.financialCompanies ? data.financialCompanies : '0'
  }
}
