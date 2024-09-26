import toast from 'react-hot-toast'

// action
import { setInvoiceDataProps, setValuePostInvoiceData } from '../invoice/InvoiceActions'
// api
import { getUsersInvitation, getClient, postClient, putClient, delClient, getClientInvoice, getCompanyInvoices, getClientByCif, getOneSuppCustRelationship, postSupplierRelationShipPaymentPreferences, getClientByCifCompany, getOneCustFinancialRelationship, getOneFinancialCustRelationship, postCustomerRelationShipPaymentPreferences, getCompanyInvoicesBySuppFinancial, getCompanyInvoicesByCustFinancial, postInviteSupplier, putAutomationRules, postInviteUser, deleteAutomationRules } from 'src/api/client'
import FormValidationManager from '../utils/managers/FormValidationManager'
import ApiResponseValidationManager from '../utils/managers/ApiResponseValidationManager'
// resources
import { strings } from '../resources/locales/i18n'
import { isDev } from '../utils/Utils'

// resources
import Types from './Types'
import CountryManager from 'src/country/CountryManager'
import { ICountry } from 'src/types/country'
import { EUserType, TypeCompany } from 'src/types/enums'
import { AutomationRules } from 'src/types/client'

/** clear */
export const clearClientDataErrors = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ERROR_CLIENT_DATA })
}

export const clearClientsFilters = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_CLIENT_FILTERS })
}

export const clearClients = ({ prop, value }) => ({
  type: Types.GET_CLIENTS_BY_CIF, 
  payload: { prop, value }
})

export const setShowSupplier = ({ prop, value }) => ({
  type: Types.SET_SHOW_SUPPLIER,
  payload: { prop, value }
})

export const setClientInvoiceData = ({ prop, value }) => ({
  type: Types.SET_CLIENT_INVOICES_DATA_PROPS,
  payload: { prop, value }
})

export const setClientSelectedByCif = ({ prop, value }) => ({
  type: Types.SET_CLIENT_SELECTED_BY_CIF,
  payload: { prop, value }
})

export const setFinancialCompany = ({ prop, value }) => ({
  type: Types.SET_FINANCIAL_COMPANY,
  payload: { prop, value }
})

export const setFinancialtSelectedByCif = ({ prop, value }) => ({
  type: Types.SET_FINANCIAL_SELECTED_BY_CIF,
  payload: { prop, value }
})

export const setFCustomerSelectedByCif = ({ prop, value }) => ({
  type: Types.SET_CUSTOMER_SELECTED_BY_CIF,
  payload: { prop, value }
})

export const setSupplierSelected = ({ prop, value }) => ({
  type: Types.SET_SELECTED_SUPPLIER,
  payload: { prop, value }
})

export const setPaymentPreferences = ({ prop, value }) => ({
  type: Types.SET_PAYMENT_PREFERENCES,
  payload: { prop, value }
})

export const setPaymentPreferencesExternal = ({ prop, value }) => ({
  type: Types.SET_PAYMENT_PREFERENCES_EXTERNAL,
  payload: { prop, value }
})

export const clearClientData = () => ({ type: Types.CLEAR_CLIENT_DATA })

export const clearClientsData = () => ({ type: Types.CLEAR_CLIENTS_DATA })

/** set */
export const setClientDataProps = ({ prop, value }) => ({
  type: Types.SET_CLIENT_DATA_PROPS,
  payload: { prop, value }
})

export const setClientNewBranchProps = ({ prop, value }) => ({
  type: Types.SET_CLIENT_NEW_BRANCH_PROPS,
  payload: { prop, value }
})

export const setValueClientFiltersData = ({ prop, value }) => ({
  type: Types.SET_VALUE_CLIENT_FILTERS_DATA,
  payload: { prop, value }
})

export const setSearchClient = ({ prop, value }) => ({
  type: Types.SET_SEARCH_CLIENT,
  payload: { prop, value }
})


export const setFinancialExistsRelatedToClient  = ({ prop, value }) => ({
  type: Types.SET_FINANCIAL_EXISTS_RELATED_TO_CLIENT,
  payload: { prop, value }
})

export const setValuePostClientData = ({ prop, value }) => ({
  type: Types.SET_VALUE_POST_CLIENT_DATA,
  payload: { prop, value }
})

export const setValuePutClientData = ({ prop, value }) => ({
  type: Types.SET_VALUE_PUT_CLIENT_DATA,
  payload: { prop, value }
})

/** get */
export const apiGetSupplierClients = () => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClients', value: true }))
  await dispatch(
    getUsersInvitation(
      (tag, response) => {
        if (isDev()) console.log('apiGetSupplierClients - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetSupplierClients - Success', response)
        dispatch({
          type: Types.GET_SUPPLIER_CLIENTS,
          payload: response?.data?.documents
        })
        dispatch(setClientDataProps({ prop: 'count', value: response.data?.count || 0 }))
      }
    )
  )
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClients', value: false }))
}

export const apiGetClient = (id) => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: true }))
  await dispatch(
    getClient(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiGetClient - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiGetClient - Success', response)
        const clientData = response?.data
        dispatch(setClient(clientData))
      }
    )
  )
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: false }))
}

export const apiGetOneSuppCustRelationship = (supplierId) => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: true }))
  await dispatch(
    getOneSuppCustRelationship(
      supplierId,
      (tag, response) => {
        if (isDev()) console.log('apiGetClient - Error', response)
      }, 
      async (tag, response) => {
        if (isDev()) console.log('apiGetClient - Success', response)
        const supplierCustomerRelationsip = response?.data?.supplierCustomerRelationsip
        const paymentPreferences = supplierCustomerRelationsip ? supplierCustomerRelationsip?.paymentPreferences ? supplierCustomerRelationsip?.paymentPreferences : undefined : undefined
        const automationRules = supplierCustomerRelationsip && supplierCustomerRelationsip?.automationRules && Array.isArray(supplierCustomerRelationsip?.automationRules) ? supplierCustomerRelationsip?.automationRules : []
        await dispatch(setPaymentPreferences({ prop: 'paymentPreferences', value: paymentPreferences}))
        await dispatch(setSupplierSelected({ prop: 'selectedSupplierId', value: supplierId}))
        await dispatch(setClientDataProps({ prop: 'companyRelationshipId', value: supplierCustomerRelationsip ? supplierCustomerRelationsip?.id : '' }))
        await dispatch(setClientDataProps({ prop: 'automationRules', value: automationRules }))
      }
    )
  )
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: false }))
}

export const apiGetOneFinancialCustRelationship = (customerId) => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: true }))
  await dispatch(
    getOneFinancialCustRelationship(
      customerId,
      (tag, response) => {
        if (isDev()) console.log('apiGetClient - Error', response)
      }, 
      async (tag, response) => {
        if (isDev()) console.log('apiGetClient - Success', response)
        const companyRelationship = response?.data?.companyRelationship
        const paymentPreferences = companyRelationship && companyRelationship?.paymentPreferencesExternal !== undefined ? companyRelationship?.paymentPreferencesExternal : undefined
        await dispatch(setPaymentPreferences({ prop: 'paymentPreferences', value: paymentPreferences}))
        await dispatch(setClientSelectedByCif({ prop: 'selectedCustomerId', value: customerId}))
      }
    )
  )
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: false }))
}

export const apiGetOneCustFinancialRelationship = () => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: true }))
  await dispatch(
    getOneCustFinancialRelationship(
      (tag, response) => {
        if (isDev()) console.log('apiGetClient - Error', response)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetClient - Success', response)
        if (response?.data && response?.data?.companyRelationship && response?.data?.companyRelationship !== undefined && response?.data?.companyRelationship?.financial && response?.data?.companyRelationship?.financial !== undefined) {
          await dispatch(setSearchClient({ prop: 'searchClient', value: response?.data?.companyRelationship?.financial?.cif }))
          await dispatch(setFinancialtSelectedByCif({ prop: 'selectedFinancialId', value: response?.data?.companyRelationship?.financial?.id }))
          await dispatch(setPaymentPreferencesExternal({ prop: 'paymentPreferencesExternal', value: response?.data?.companyRelationship?.paymentPreferencesExternal }))
          await dispatch(setFinancialCompany({ prop: 'financial', value: response?.data?.companyRelationship?.financial}))
        } else {
          await dispatch(setFinancialtSelectedByCif({ prop: 'selectedFinancialId', value: '' }))
          await dispatch(setSearchClient({ prop: 'searchClient', value: '' }))
          await dispatch(setPaymentPreferencesExternal({ prop: 'paymentPreferencesExternal', value: '' }))
          await dispatch(setFinancialCompany({ prop: 'financial', value: undefined}))
        }
      
      }
    )
  )
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: false }))
}

export const apiGetCompanyInvoices = (id, typeRole = EUserType.PAYER) => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: true }))
  await dispatch(
    getCompanyInvoices(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiGetCompanyInvoices - Error', response)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetCompanyInvoices - Success', response)
        const clientData = response?.data
        await dispatch(setClientInvoiceData({ prop: 'invoicesList', value: clientData }))
      },
      typeRole
    )
  )
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: false }))
}

export const apiGetCompanyInvoicesBySuppFinancial = (id, typeRole = EUserType.PAYER) => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: true }))
  await dispatch(
    getCompanyInvoicesBySuppFinancial(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiGetCompanyInvoices - Error', response)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetCompanyInvoices - Success', response)
        const clientData = response?.data
        await dispatch(setClientInvoiceData({ prop: 'invoicesList', value: clientData }))
      },
      typeRole
    )
  )
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: false }))
}

export const apiGetCompanyInvoicesByCustFinancial = (id, typeRole = EUserType.PAYER) => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: true }))
  await dispatch(
    getCompanyInvoicesByCustFinancial(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiGetCompanyInvoices - Error', response)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetCompanyInvoices - Success', response)
        const clientData = response?.data
        await dispatch(setClientInvoiceData({ prop: 'invoicesList', value: clientData }))
      },
      typeRole
    )
  )
  await dispatch(setClientDataProps({ prop: 'isLoadingGetClient', value: false }))
}

export const apiGetClientInvoice = (invoiceId, success?) => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingGetInvoice', value: true }))

  await dispatch(
    getClientInvoice(
      invoiceId,
      (tag, response) => {
        if (isDev()) console.log('apiGetClientInvoice - Error', response)
        if (response?.message) toast.error(response.message)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetClientInvoice', response)
        await dispatch(setClientInvoiceData({ prop: 'invoiceDetail', value: response.data }))
        success && success()
      }
    )
  )
  await dispatch(setClientDataProps({ prop: 'isLoadingGetInvoice', value: false }))
}

export const apiGetClientByCif = (cif, typeCompany?, success?) => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingGetInvoice', value: true }))
  await dispatch(
    getClientByCif(
      cif,
      (tag, response) => {
        if (isDev()) console.log('apiGetClientInvoice - Error', response)
        if (response?.message) toast.error(response.message)

        dispatch({
          type: Types.GET_CLIENTS_BY_CIF,
          payload: []
        })

        if (typeCompany === TypeCompany.CORPORATION) {
        dispatch({
          type: Types.GET_USERS_COMPANY,
          payload: []
        })
      }

      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetClientByCif', response)
        
        dispatch({
          type: Types.GET_CLIENTS_BY_CIF,
          payload: response?.data
        })

        if (typeCompany === TypeCompany.CORPORATION) {
          dispatch({
            type: Types.GET_USERS_COMPANY,
            payload: response?.users
          })
        }
        success && success()
      }
    )
  )
  await dispatch(setClientDataProps({ prop: 'isLoadingGetInvoice', value: false }))
}

export const apiGetClientByCifCompany = (cif, success?) => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingGetInvoice', value: true }))
  await dispatch(
    getClientByCifCompany(
      cif,
      (tag, response) => {
        if (isDev()) console.log('apiGetClientInvoice - Error', response)
        if (response?.message) toast.error(response.message)

        dispatch({
          type: Types.GET_CLIENTS_BY_CIF,
          payload: []
        })

      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetClientByCif', response)
        
        dispatch({
          type: Types.GET_CLIENTS_BY_CIF,
          payload: response?.data
        })
        success && success()
      }
    )
  )
  await dispatch(setClientDataProps({ prop: 'isLoadingGetInvoice', value: false }))
}

export const setClient = (clientData) => async (dispatch) => {
  const client = {
    id: clientData?.id,
    firstName: clientData?.firstName,
    bankInformation: clientData?.company?.bankInformation,
    lastName: clientData?.lastName,
    email: clientData?.email,
    phone: clientData?.phoneNumber,
    companyName: clientData?.company.name,
    name: clientData?.company.name,
    companyCIF: clientData?.company.cif,
    pinAccess: clientData?.pinAccess,
    cif: clientData?.company.cif,
    companyAddress: clientData?.company.address,
    currencyCode: clientData?.company?.currencyCode,
    companyPostalCode: clientData?.company.postalCode,
    postalCode: clientData?.company.postalCode,
    companyCity: clientData?.company.city,
    city: clientData?.company.city,
    companyCountry: clientData?.company.country,
    typeCompany: clientData?.company.typeCompany,
    companyRegion: clientData?.company.region,
    userType: clientData?.user ? clientData?.user?.userType : ''
  }
  await dispatch({
    type: Types.GET_CLIENT,
    payload: client
  })
  await dispatch(setInvoiceDataProps({ prop: 'emails', value: clientData?.email }))
}

/** post */

export const validatePostClient = () => async (dispatch, getState) => {
  const { client } = getState().ClientReducer
  const {
    firstName,
    lastName,
    email,
    companyName,
    companyCIF,
    companyAddress,
    companyPostalCode,
    companyCity,
    companyCountry,
    companyRegion
  } = client
  const { country }: {country: ICountry} = getState().CountryReducer
  const regionRequired = CountryManager.getCountryRegions(country).length > 0
  const companyCifRequired = true
  // const companyCifRequired = CountryManager.getCountryTaxIdRequired(country)

  const error = FormValidationManager.formPostClient({
    firstName: firstName || '',
    lastName: lastName || '',
    email: email || '',
    companyName: companyName || '',
    companyCIF: companyCIF || '',
    companyAddress: companyAddress || '',
    companyPostalCode: companyPostalCode || '',
    companyCity: companyCity || '',
    companyCountry: companyCountry || '',
    companyRegion: companyRegion || '',
    taxIdRequired: companyCifRequired,
    regionRequired,
    isClient: true
  })

  await dispatch(setClientDataProps({ prop: 'errorClientData', value: error }))
  return error
}

export const apiPostClient = () => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingPostDataClient', value: true }))

  await dispatch(
    postClient(
      (tag, response) => {
        if (isDev()) console.log('postClient - Error', response)
        ApiResponseValidationManager.postClient(response, dispatch, setClientDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPostClient'))
      },
      (tag, response) => {
        if (isDev()) console.log('postClient', response)
        dispatch(setValuePostClientData({ prop: 'id', value: response?.data?.client?.id }))
        dispatch(setValuePostInvoiceData({ prop: 'customerId', value: response?.data?.client?.id }))
        document.getElementById('modal-open-newClientOK')?.click()
      }
    )
  )

  await dispatch(setClientDataProps({ prop: 'isLoadingPostDataClient', value: false }))
  await dispatch(setClientDataProps({ prop: 'submitPost', value: false }))
}

export const apiPostInviteSupplier = (email, name) => async (dispatch) => {
  await dispatch(
    postInviteSupplier(
      email,
      name,
      (tag, response) => {
        if (isDev()) console.log('postClient - Error', response)
      },
      (tag, response) => {
        toast.success(strings('toasts.alert.inviteSuccess'))
      }
    )
  )

  await dispatch(setClientDataProps({ prop: 'isLoadingPostDataClient', value: false }))
  await dispatch(setClientDataProps({ prop: 'submitPost', value: false }))
}

export const apiPostInviteUser = (email, name) => async (dispatch) => {
  await dispatch(
    postInviteUser(
      email,
      name,
      (tag, response) => {
        if (isDev()) console.log('postClient - Error', response)
      },
      (tag, response) => {
        toast.success(strings('toasts.alert.inviteSuccess'))
      }
    )
  )

  await dispatch(setClientDataProps({ prop: 'isLoadingPostDataClient', value: false }))
  await dispatch(setClientDataProps({ prop: 'submitPost', value: false }))
}

export const apiPostSupplierRelationShipPaymentPreferences = () => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingPostDataClient', value: true }))

  await dispatch(
    postSupplierRelationShipPaymentPreferences(
      (tag, response) => {
        if (isDev()) console.log('postClient - Error', response)
        ApiResponseValidationManager.postClient(response, dispatch, setClientDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPostClient'))
      },
      async (tag, response) => {
        if (isDev()) console.log('postClient', response)
      }
    )
  )

  await dispatch(setClientDataProps({ prop: 'isLoadingPostDataClient', value: false }))
  await dispatch(setClientDataProps({ prop: 'submitPost', value: false }))
}

export const apiPostCustomerRelationShipPaymentPreferences = () => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingPostDataClient', value: true }))

  await dispatch(
    postCustomerRelationShipPaymentPreferences(
      (tag, response) => {
        if (isDev()) console.log('postClient - Error', response)
        ApiResponseValidationManager.postClient(response, dispatch, setClientDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPostClient'))
      },
      async (tag, response) => {
        if (isDev()) console.log('postClient', response)
      }
    )
  )

  await dispatch(setClientDataProps({ prop: 'isLoadingPostDataClient', value: false }))
  await dispatch(setClientDataProps({ prop: 'submitPost', value: false }))
}
/** put */

export const apiPutClient = (id) => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingPutDataClient', value: true }))

  await dispatch(
    putClient(
      id,
      (tag, response) => {
        if (isDev()) console.log('putClient - Error', response)
        ApiResponseValidationManager.postClient(response, dispatch, setClientDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPutClient'))
      },
      (tag, response) => {
        if (isDev()) console.log('putClient', response)
        document.getElementById('modal-open-updateOK')?.click()
      }
    )
  )

  await dispatch(setClientDataProps({ prop: 'isLoadingPutDataClient', value: false }))
  await dispatch(setClientDataProps({ prop: 'submitPut', value: false }))
}

export const apiPutAutomationRules = (selectedSupplierId, id, data: AutomationRules) => async (dispatch) => {

  await dispatch(
    putAutomationRules(
      id,
      data,
      (tag, response) => {
      },
      async (tag, response) => {
        await dispatch(apiGetOneSuppCustRelationship(selectedSupplierId))
        toast.success(strings('placeholder.createdRule'))
      }
    )
  )  
}

export const apiDeleteAutomationRules = (selectedSupplierId, id, index) => async (dispatch) => {

  await dispatch(
    deleteAutomationRules(
      id,
      index,
      (tag, response) => {
      },
      async (tag, response) => {
        await dispatch(apiGetOneSuppCustRelationship(selectedSupplierId))
        toast.success(strings('placeholder.ruleHasBeenRemoved'))
      }
    )
  )  
}


/** delete */

export const apiDeleteClient = (id) => async (dispatch) => {
  await dispatch(setClientDataProps({ prop: 'isLoadingDeleteClient', value: true }))

  await dispatch(
    delClient(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiDeleteClient - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiDeleteClient - Success', response)
        dispatch({ type: Types.CLEAR_CLIENT_DATA })
      }
    )
  )

  await dispatch(setClientDataProps({ prop: 'isLoadingDeleteClient', value: false }))
}
