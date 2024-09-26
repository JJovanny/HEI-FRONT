import { strings } from 'src/resources/locales/i18n'

export default class ApiResponseValidationManager {
  static putUser = (response, dispatch, setUserDataProps) => {
    if (response?.data?.message?.includes('email')) {
      dispatch(setUserDataProps({ prop: 'errorUserData', value: [{ key: 'email', value: strings('validation.error.emailAddressInUse') }] }))
    }
    if (response?.data?.message?.includes('phoneNumber')) {
      dispatch(setUserDataProps({ prop: 'errorUserData', value: [{ key: 'phone', value: strings('validation.error.phoneNumberInUse') }] }))
    }
    if (response?.data?.customer?.customerData?.company?.cif) {
      dispatch(setUserDataProps({ prop: 'errorUserData', value: [{ key: 'companyCIF', value: strings('validation.error.companyCifInUse') }] }))
    }
    if (response?.data?.document) {
      dispatch(setUserDataProps({ prop: 'errorUserData', value: [{ key: 'companyCIF', value: strings('validation.error.companyCifInUse') }] }))
    }
  }

  static postUser = (response, dispatch, setUserDataProps) => {
    if (response?.data?.customer?.customerData?.company?.cif) {
      dispatch(setUserDataProps({ prop: 'errorUserData', value: [{ key: 'companyCIF', value: strings('validation.error.companyCifInUse') }] }))
    }
    if (response?.data?.document) {
      dispatch(setUserDataProps({ prop: 'errorUserData', value: [{ key: 'companyName', value: strings('validation.error.companyNameInUse') }] }))
    }
    if (response?.message?.includes('code')) {
      dispatch(setUserDataProps({ prop: 'errorUserData', value: [{ key: 'verificationCode', value: response.message }] }))
    }
  }

  static postClient = (response, dispatch, setClientDataProps) => {
    if (response?.data?.message?.includes('email')) {
      dispatch(setClientDataProps({ prop: 'errorClientData', value: [{ key: 'email', value: strings('validation.error.emailAddressInUse') }] }))
    }
    if (response?.data?.message?.includes('phoneNumber')) {
      dispatch(setClientDataProps({ prop: 'errorClientData', value: [{ key: 'phone', value: strings('validation.error.phoneNumberInUse') }] }))
    }
  }

  static postInvoice = (response, dispatch, setInvoiceDataProps) => {
    if (response?.data?.customer?.customerData?.company?.cif) {
      dispatch(setInvoiceDataProps({ prop: 'errorInvoiceData', value: [{ key: 'companyCIF', value: strings('validation.error.companyCifInUse') }] }))
    }
    if (response.data?.issueDate) {
      dispatch(setInvoiceDataProps({ prop: 'errorInvoiceData', value: [{ key: 'issueDate', value: response.data.issueDate }] }))
    }
    if (response.data?.document) {
      dispatch(setInvoiceDataProps({ prop: 'errorInvoiceData', value: [{ key: 'invoiceNumber', value: strings('validation.error.invoiceNumberInUse') }] }))
    }
    if (response?.message?.includes('same company')) {
      dispatch(setInvoiceDataProps({ prop: 'errorInvoiceData', value: [{ key: 'sameCompany', value: strings('validation.error.sameCompany') }] }))
    }
  }

  static postValidateUserForInvoice = (response, dispatch, setClientDataProps) => {
    if (response?.message?.includes('name')) {
      dispatch(setClientDataProps({ prop: 'errorClientData', value: [{ key: 'companyName', value: response?.message }] }))
    }

    if (response?.message?.includes('CIF')) {
      dispatch(setClientDataProps({ prop: 'errorClientData', value: [{ key: 'companyCIF', value: response?.message }] }))
    }

    if (response?.message?.includes('number')) {
      dispatch(setClientDataProps({ prop: 'errorClientData', value: [{ key: 'phone', value: response?.message }] }))
    }
  }

  static supplierTax = (response, dispatch, setTaxDataProps) => {
    if (response.message?.includes('name')) {
      dispatch(setTaxDataProps({ prop: 'errorTaxData', value: [{ key: 'name', value: strings('validation.error.taxNameInUse') }] }))
    }
  }
}
