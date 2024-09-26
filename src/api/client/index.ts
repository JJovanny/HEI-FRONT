import { EUserType } from 'src/types/enums'
import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'
import { AutomationRules, IClientState } from 'src/types/client'

export const delClient = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer

  const url = '/api/v1/app/client/' + id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.DEL_CLIENT, Verbs.DEL, url, config, null, callbackError, callbackSuccess))
}

export const getClient = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/company/client/' + id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_CLIENT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getOneSuppCustRelationship = (supplierId, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
  const customerId = companyBranchSelected && companyBranchSelected !== undefined ? companyBranchSelected?.id : ''
  const url = `/api/v1/app/supplier-customer/supplier/${supplierId}/customer/${customerId}`
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_CLIENT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}


export const getOneFinancialCustRelationship = (customerId, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
  const financialId = companyBranchSelected && companyBranchSelected !== undefined ? companyBranchSelected?.id : ''
  const url = `/api/v1/app/supplier-customer/customer/${customerId}/financial/${financialId}`
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_CLIENT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getOneCustFinancialRelationship = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
  const customerId = companyBranchSelected && companyBranchSelected !== undefined ? companyBranchSelected?.id : ''
  const url = `/api/v1/app/supplier-customer/customer/${customerId}`
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_CLIENT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getCompanyInvoices = (id, callbackError, callbackSuccess, typeRole = EUserType.PAYER) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
  let url = '/api/v1/app/company/client/invoices/' + id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  if (companyBranchSelected && companyBranchSelected !== undefined && companyBranchSelected?.id !== undefined) url += `?companyBranchSelected=${companyBranchSelected?.id}`
  if (typeRole) url += `&typeRole=${typeRole}`

  return dispatch(launchAsyncTask(Tags.GET_CLIENT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getCompanyInvoicesBySuppFinancial = (id, callbackError, callbackSuccess, typeRole = EUserType.PAYER) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
  let url = '/api/v1/app/company/client/invoices/' + id+'/financial'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  if (companyBranchSelected && companyBranchSelected !== undefined && companyBranchSelected?.id !== undefined) url += `?companyBranchSelected=${companyBranchSelected?.id}`
  if (typeRole) url += `&typeRole=${typeRole}`

  return dispatch(launchAsyncTask(Tags.GET_CLIENT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getCompanyInvoicesByCustFinancial = (id, callbackError, callbackSuccess, typeRole = EUserType.PAYER) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
  let url = '/api/v1/app/company/client/invoices/' + id+'/customer'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  if (companyBranchSelected && companyBranchSelected !== undefined && companyBranchSelected?.id !== undefined) url += `?companyBranchSelected=${companyBranchSelected?.id}`
  if (typeRole) url += `&typeRole=${typeRole}`

  return dispatch(launchAsyncTask(Tags.GET_CLIENT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getClientInvoice = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/company/client/invoice/' + id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_CLIENT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getClientByCif = (cif, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer
  if (!cif) return
  const url = '/api/v1/app/company/client-cif/' + cif
  
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  return dispatch(launchAsyncTask(Tags.GET_CLIENT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getClientByCifCompany = (cif, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  if (!cif) return
  const url = '/api/v1/app/company/client-cif/' + cif + '/company'
  
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  return dispatch(launchAsyncTask(Tags.GET_CLIENT, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getUsersInvitation = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer
  const { page, limit, filters } = getState().ClientReducer
  const { filterCompanyName, filterCompanyContactEmail } = filters

  let url = '/api/v1/app/user/me/invitation'

  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  if (page > 0) url += '?page=' + page
  if (limit > 0) url += '&limit=' + limit


  return dispatch(launchAsyncTask(Tags.GET_SUPPLIER_CLIENTS, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const postClient = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/client'

  const { accessToken } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { client } = getState().ClientReducer
  const {
    firstName,
    lastName,
    email,
    companyName,
    companyAddress,
    companyPostalCode,
    companyCity,
    companyCountry,
    companyRegion
  } = client
  let { companyCIF, phone } = client
  if (companyCIF?.length <= 0) companyCIF = undefined
  if (phone?.length <= 0) phone = undefined

  const params = {
    firstName,
    lastName,
    email,
    phoneNumber: phone,
    company: {
      name: companyName,
      cif: companyCIF,
      address: companyAddress,
      city: companyCity,
      postalCode: companyPostalCode,
      country: companyCountry,
      region: companyRegion
    }
  }

  return dispatch(launchAsyncTask(Tags.POST_CLIENT, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const postInviteSupplier = (email, name, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/company/invite-supplier'
  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer

  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  
  const params = {
    email,
    name,
    customerId: companyBranchSelected ? companyBranchSelected?.id : ''
  }

  return dispatch(launchAsyncTask(Tags.POST_CLIENT, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const postInviteUser = (email, name, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/company/invite-user'
  const { accessToken, dataUser: { companyBranchSelected, firstName, lastName } } = getState().UserReducer
  
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }
  
  const params = {
    user: firstName + ' '+ lastName,
    email,
    name,
    customerId: companyBranchSelected ? companyBranchSelected?.id : ''
  }

  return dispatch(launchAsyncTask(Tags.POST_CLIENT, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const postSupplierRelationShipPaymentPreferences = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/supplier-customer'

  const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { selectedSupplierId, paymentPreferences } = getState().ClientReducer as IClientState

  const params = {
    customer: companyBranchSelected && companyBranchSelected !== undefined ? companyBranchSelected?.id : '',
    supplier: selectedSupplierId,
    paymentPreferences
  }

  return dispatch(launchAsyncTask(Tags.POST_CLIENT, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const postCustomerRelationShipPaymentPreferences = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const url = '/api/v1/app/supplier-customer/financial'

  const { accessToken, dataUser: { companyBranchSelected, userType } } = getState().UserReducer
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { selectedCustomerId, paymentPreferences } = getState().ClientReducer

  let creditLimit = paymentPreferences.creditLimit

  if (typeof creditLimit === 'string') {
    creditLimit = creditLimit.replace(/[.,]/g, '');
    creditLimit = parseInt(creditLimit, 10);
  }

  const params = {
    financial: companyBranchSelected && companyBranchSelected !== undefined ? companyBranchSelected?.id : '',
    customer: selectedCustomerId,
    paymentPreferencesExternal: {
      ...paymentPreferences,
      creditLimit: creditLimit,
      availableCredit: creditLimit,
    }
  }

  return dispatch(launchAsyncTask(Tags.POST_CLIENT, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const putClient = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/client/' + id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const { client } = getState().ClientReducer
  const {
    firstName,
    lastName,
    email,
    companyName,
    companyAddress,
    companyPostalCode,
    companyCity,
    companyCountry,
    companyRegion
  } = client
  let { companyCIF, phone } = client
  if (companyCIF?.length <= 0) companyCIF = undefined
  if (phone?.length <= 0) phone = undefined

  const params = {
    firstName,
    lastName,
    email,
    phoneNumber: phone,
    company: {
      name: companyName,
      cif: companyCIF,
      address: companyAddress,
      city: companyCity,
      postalCode: companyPostalCode,
      country: companyCountry,
      region: companyRegion
    }
  }

  return dispatch(launchAsyncTask(Tags.PUT_CLIENT, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
}

export const putAutomationRules = (id, data: AutomationRules, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/supplier-customer/rules/'+id
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  let payload = {...data}

  if (payload.andOr !== undefined && payload.andOr !== '' && payload.secondLogicalOperator === '') {
    const { andOr, ...rest } = payload;
    payload = rest;
  }
  
  const params = Object.entries(payload).reduce((acc, [key, value]) => {
    if (value !== '' && value !== 0) {
      acc[key] = value;
    }
    return acc;
  }, {});  

  return dispatch(launchAsyncTask(Tags.PUT_CLIENT, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
}


export const deleteAutomationRules = (id, index, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = '/api/v1/app/supplier-customer/rules/'+id+'/delete/'+index
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const params = {};  

  return dispatch(launchAsyncTask(Tags.PUT_CLIENT, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
}


