export default class Routing {
  /** App **/
  static id = ':id'
  static idCategories = '?'
  static nowhere = '#'
  static home = '/'

  /** Auth Scene **/
  static login = '/login'
  static verificationCode = '/verificationCode'
  static resetPassword = '/set-password'
  static registerEmail = '/sign-up'
  static registerData = '/sign-up/registerData'

  /** Dashboard **/
  static dashboard = '/dashboard'

  /** Invoices */
  static quickPayInvoices = '/invoices/quickpay'
  static users = '/users-invite'
  static invoices = '/users-invite'
  static addInvoice = '/invoices/add'

  static shoppingCart = '/shopping-cart'

  /** Clients */
  static customers = '/customers'
  static customer = '/customer'
  static addClient = '/clients/add'

  static financialCustomer = '/financial/customer'
  static financialSupplier = '/financial/supplier'
  static financialBilling = '/financial/billing'

  /** Supplier */
  static suppliers = '/suppliers'
  static suppliersCustomers = '/suppliers/customers'
  static profile = '/profile'

  /** Taxes */
  static taxes = '/taxes'
  static addTax = '/taxes/add'

  /** Payers */
  static payers = '/payers'
  static payersBilling = '/payers/billing'

  /** Admin user **/ 
  static adminLogin = '/admin/login'
  static adminVerificationCode = '/admin/verificationCode'
  static adminOnboardingProfiles = '/admin/onboardingProfiles'
  static adminAssociatedCompanies = '/admin/associatedCompanies'
  static adminInvoices = '/admin/invoices'
  static adminProfile = '/admin/profile'
  static adminUsers = '/admin/users'
  static adminNewUser = '/admin/users/new'
  static adminHome = '/admin/'
}
