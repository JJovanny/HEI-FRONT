import { combineReducers, AnyAction } from 'redux'
import AppReducer from '../app/AppReducer'
import LoginReducer from '../login/LoginReducer'
import InvoiceReducer from '../invoice/InvoiceReducer'
import ClientReducer from '../client/ClientReducer'
import TaxReducer from '../tax/TaxReducer'
import CountryReducer from 'src/country/CountryReducer'
import UserReducer from 'src/user/UserReducer'
import ReceivedInvoiceReducer from 'src/receivedInvoice/ReceivedInvoiceReducer'
import DashboardReducer from 'src/dashboard/DashboardReducer'
import SupplierReducer from 'src/supplier/SupplierReducer'
import PayersReducer from 'src/payers/PayersReducer'
import AdminLoginReducer from 'src/admin/login/AdminLoginReducer'
import AdminUserReducer from 'src/admin/user/AdminUserReducer'
import OnboardingProfileReducer from 'src/admin/onboardingProfile/OnboardingProfileReducer'
import ProductReducer from 'src/admin/products/ProductReducer'
import CompaniesReducer from 'src/admin/companies/CompaniesReducer'
import AdminInvoicesReducer from 'src/admin/invoices/AdminInvoicesReducer'
import UserCompanyReducer from 'src/admin/userCompany/UserCompanyReducer'
import NotificationReducer from 'src/notifications/NotificationReducer'

// Reducers
const reducer = combineReducers({
  AppReducer,
  UserReducer,
  LoginReducer,
  InvoiceReducer,
  ClientReducer,
  TaxReducer,
  CountryReducer,
  ReceivedInvoiceReducer,
  DashboardReducer,
  SupplierReducer,
  PayersReducer,
  NotificationReducer,
  AdminLoginReducer,
  AdminUserReducer,
  OnboardingProfileReducer,
  CompaniesReducer,
  AdminInvoicesReducer,
  UserCompanyReducer,
  ProductReducer
})

export const RootReducer = (state: any, action: AnyAction) => {
  if (action.type === 'RESET_STATE') {
    state = undefined
  }

  return reducer(state, action)
}
