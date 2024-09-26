import toast from 'react-hot-toast'
// actions
import { clearInvoiceToInitialState } from '../invoice/InvoiceActions'
import { clearLoginData } from 'src/login/LoginActions'
// api
import { postRequestRegister, postConfirmRegister, postRequestUpdateEmail, postConfirmUpdateEmail } from 'src/api/auth'
import { getUserMe, putUser, delUser, postExternalPayment, patchPaymentPreferences, putUserType, postUserApi } from 'src/api/user'
import FormValidationManager from '../utils/managers/FormValidationManager'
import ApiResponseValidationManager from '../utils/managers/ApiResponseValidationManager'
// resources
import { strings } from '../../src/resources/locales/i18n'
import { isDev } from '../utils/Utils'
// resources
import Types from './Types'
import { ICountry } from 'src/types/country'
import CountryManager from 'src/country/CountryManager'
import { clearDataDashboard } from 'src/dashboard/DashboardActions'
import { IPaymentPreferences } from 'src/types/invoice'
import { setAdminUserLogout } from 'src/admin/user/AdminUserActions'
import { IUserState } from 'src/types/user'
import { setFinancialExistsRelatedToClient, setFinancialtSelectedByCif, setSearchClient } from 'src/client/ClientActions'
import { EUserType, TypeCompany } from 'src/types/enums'

/** clear */
export const clearUserDataErrors = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ERROR_USER_DATA })
}

export const clearUserAccessToken = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_USER_ACCESS_TOKEN })
}

export const clearSupplierData = () => ({ type: Types.CLEAR_USER_DATA })

export const clearChangeEmailData = () => ({ type: Types.CLEAR_CHANGE_EMAIL_DATA })

export const clearPostDataUser = () => ({ type: Types.CLEAR_POST_DATA_USER })

export const clearErrorUserDataPut = () => ({ type: Types.CLEAR_ERROR_USER_DATA_PUT })

/** set */
export const setUserAccessToken = (response) => async (dispatch) => {
  dispatch({
    type: Types.SET_USER_ACCESS_TOKEN,
    payload: response
  })
}
export const setUserLogout = () => async (dispatch) => {
  await dispatch({ type: Types.SET_USER_LOGOUT })
  await dispatch(clearDataDashboard())
  await dispatch(clearInvoiceToInitialState())
}

export const setUserDataProps = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_USER_DATA_PROPS,
  payload: { prop, value }
})
export const setUserCompanyBranchSelected = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_USER_COMPANY_BRANCH_SELECTED,
  payload: { prop, value }
})

export const setValuePostDataUser = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_VALUE_POST_DATA_USER,
  payload: { prop, value }
})

export const setValueChangeEmail = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_VALUE_CHANGE_EMAIL,
  payload: { prop, value }
})

export const setValuePutDataUser = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_VALUE_PUT_DATA_USER,
  payload: { prop, value }
})

/** post */
export const postRegisterEmail = (email,payer, redirect) => async (dispatch) => {
  await dispatch(setUserDataProps({ prop: 'isLoadingPostDataUser', value: true }))
  await dispatch(clearUserAccessToken())
  await dispatch(clearUserDataErrors())

  await dispatch(
    postRequestRegister(
      email,
      payer,
      (tag, response) => {
        if (isDev()) console.log('postRegisterEmail - Error', response)
        dispatch(setUserDataProps({ prop: 'errorUserData', value: [{ key: 'email', value: response.data.message }] }))
        if (response?.message) {
          toast.error(response.message)
        }else if (response?.data?.message) {
          toast.error(response?.data?.message)
        } else toast.error(strings('toasts.alert.errorRegisterEmail'))
      },
      (tag, response) => {
        if (isDev()) console.log('postRegisterEmail', response)
        dispatch(setUserDataProps({ prop: 'submitPost', value: false }))
        redirect()
      }
    )
  )

  await dispatch(setUserDataProps({ prop: 'isLoadingPostDataUser', value: false }))
}


export const postUser = (data) => async (dispatch) => {

  await dispatch(
    postUserApi(
      data,
      (tag, response) => {
        
      },
      (tag, response) => {

      }
    )
  )

  await dispatch(setUserDataProps({ prop: 'isLoadingPostDataUser', value: false }))
}

export const apiPostExternalPayment = (externalPayment) => async (dispatch) => {
  await dispatch(setUserDataProps({ prop: 'isLoadingPostExternalPayment', value: true }))

  await dispatch(
    postExternalPayment(
      { externalPayment },
      (tag, response) => {
        if (isDev()) console.log('apiPostExternalPayment - Error', response)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiPostExternalPayment', response)
        await dispatch(apiGetUserMe())
      }
    )
  )

  await dispatch(setUserDataProps({ prop: 'isLoadingPostExternalPayment', value: false }))
}

export const validatePostRegisterEmail = () => async (dispatch, getState) => {
  const { postDataUser, acceptUseConditions } = getState().UserReducer
  const { email } = postDataUser
  const error = FormValidationManager.formRegisterEmail({
    email,
    acceptUseConditions
  })

  await dispatch(setUserDataProps({ prop: 'errorUserData', value: error }))
  return error
}

export const postRegisterUser = (postDataUser, redirect) => async (dispatch) => {
  await dispatch(setUserDataProps({ prop: 'isLoadingPostDataUser', value: true }))

  await dispatch(
    postConfirmRegister( 
      postDataUser,
      (tag, response) => {
        if (isDev()) console.log('postRegisterUser - Error', response)
        ApiResponseValidationManager.postUser(response, dispatch, setUserDataProps)
        if (response?.data && response?.data.message) {
          toast.error(response.data.message)
        } else toast.error(strings('toasts.alert.errorPostUser'))
      },
      (tag, response) => {
        if (isDev()) console.log('postRegisterUser', response)
        dispatch(setUserAccessToken(response))
        /** Método cargar facturas */
        dispatch(clearLoginData())
        dispatch(clearPostDataUser())
        dispatch(setAdminUserLogout())
        dispatch(apiGetUserMe())
        dispatch(setUserDataProps({ prop: 'submitPost', value: false }))
        redirect()
      }
    )
  )

  await dispatch(setUserDataProps({ prop: 'isLoadingPostDataUser', value: false }))
}

export const validatePostUser = () => async (dispatch, getState) => {
  const { postDataUser } = getState().UserReducer

  const error = FormValidationManager.formPostSupplier({
    email: postDataUser?.email || '',
    firstName: postDataUser?.firstName || '',
    phone: postDataUser?.phone || '',
    lastName: postDataUser?.lastName || '',
    ci: postDataUser?.ci || '',
    ciInvitation: postDataUser?.ciInvitation || ''
  })
  await dispatch(setUserDataProps({ prop: 'errorUserData', value: error }))
  return error
}

export const apiPostRequestUpdateEmail = (success?) => async (dispatch, getState) => {
  const { changeEmail } = getState().UserReducer as IUserState
  await dispatch(clearUserDataErrors())
  await dispatch(setUserDataProps({ prop: 'isLoadingPostChangeEmail', value: true }))

  await dispatch(
    postRequestUpdateEmail(
      changeEmail?.newEmail,
      (tag, response) => {
        if (isDev()) console.log('apiPostRequestUpdateEmail - Error', response)
        dispatch(setUserDataProps({ prop: 'errorUserData', value: [{ key: 'newEmail', value: response.data.message }] }))
      },
      (tag, response) => {
        if (isDev()) console.log('apiPostRequestUpdateEmail', response)
        dispatch(setUserDataProps({ prop: 'submitPost', value: false }))
        success && success()
      }
    )
  )

  await dispatch(setUserDataProps({ prop: 'isLoadingPostChangeEmail', value: false }))
}

export const validatePostUpdateEmail = () => async (dispatch, getState) => {
  const { changeEmail } = getState().UserReducer as IUserState
  const { newEmail } = changeEmail

  const error = FormValidationManager.formRequestLogin({ email: newEmail })

  await dispatch(setUserDataProps({ prop: 'errorUserData', value: error }))
  return error
}

export const apiPostConfirmUpdateEmail = (success?) => async (dispatch, getState) => {
  const { changeEmail } = getState().UserReducer as IUserState
  await dispatch(clearUserDataErrors())
  await dispatch(setUserDataProps({ prop: 'isLoadingConfirmChangeEmail', value: true }))

  await dispatch(
    postConfirmUpdateEmail(
      changeEmail,
      async (tag, response) => {
        if (isDev()) console.log('apiPostConfirmUpdateEmail - Error', response)
        dispatch(setUserDataProps({ prop: 'errorUserData', value: [{ key: 'verificationCode', value: response.data.message }] }))
        await dispatch(setUserDataProps({ prop: 'isLoadingConfirmChangeEmail', value: false }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPostLogin'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiPostConfirmUpdateEmail', response)
        await dispatch(apiGetUserMe())
        dispatch(setUserDataProps({ prop: 'submitPost', value: false }))
        toast.success(strings('toasts.message.updateEmail'))
        success && success()
        await dispatch(setUserDataProps({ prop: 'isLoadingConfirmChangeEmail', value: false }))
      }
    )
  )
}

export const validatePostConfirmUpdateEmail = () => async (dispatch, getState) => {
  const { changeEmail } = getState().UserReducer as IUserState
  const { newEmail: email, verificationCode } = changeEmail

  const error = FormValidationManager.formConfirmLogin({
    email,
    verificationCode
  })

  await dispatch(setUserDataProps({ prop: 'errorUserData', value: error }))
  return error
}

/** get */
export const apiGetUserMe = (load = true) => async (dispatch, getState) => {
  if (load) await dispatch(setUserDataProps({ prop: 'isLoadingGetSupplierMe', value: true }))
  await dispatch(
    getUserMe(
      (tag, response) => {
        if (isDev()) console.log('apiGetUserMe - Error', response)
      },
      async (tag, response) => { 
        if (isDev()) console.log('apiGetUserMe - Success', response)
        const userData = response?.data?.me
        const { dataUser: { companyBranchSelected, userType } } = getState().UserReducer as IUserState
        const companyBranchDefault = Array.isArray(userData?.companyBranchs) && userData?.companyBranchs.length !== 0 ? userData?.companyBranchs[0] : {}
        const user = {
          id: userData?.id ? userData.id : '',
          firstName: userData?.firstName ? userData.firstName : '',
          lastName: userData?.lastName ? userData.lastName : '',
          pinAccess:  userData?.pinAccess ? userData.pinAccess : false,
          pinSuccess:  userData?.pinSuccess ? userData.pinSuccess : false,
          currencyCode: userData?.company?.currencyCode ? userData?.company?.currencyCode : '',
          bankInformation: userData?.company?.bankInformation ? userData.company?.bankInformation : '',
          typeCompany: userData?.company?.typeCompany ?  userData?.company?.typeCompany : '',
          email: userData?.email ? userData.email : '',
          phone: userData?.phoneNumber ? userData.phoneNumber : '',
          userType: userData?.userType ? userData.userType : '',
          companyName: userData?.company?.name ? userData.company.name : '',
          companyCIF: userData?.company?.cif ? userData.company.cif : '',
          companyAddress: userData?.company?.address ? userData.company.address : '',
          companyPostalCode: userData?.company?.postalCode ? userData.company.postalCode : '',
          companyCity: userData?.company?.city ? userData.company.city : '',
          companyCountry: userData?.company?.country?.code ? userData.company.country.code : '',
          companyRegion: userData?.company?.region ? userData.company.region : '',
          financialCompany: userData?.company?.financialCompany ? userData.company.financialCompany : [],
          paymentPreferences: userData?.company?.paymentPreferences ? userData.company.paymentPreferences : {} as IPaymentPreferences,
          externalPayment: userData?.company?.externalPayment,
          companyBranchs: userData?.companyBranchs || [],
          companyBranchSelected: companyBranchSelected && Object.keys(companyBranchSelected).length !== 0 ? companyBranchSelected : companyBranchDefault
        }

        if (userData && userData?.companyRelationship && userData?.companyRelationship !== undefined && userData?.companyRelationship?.financial && userData?.companyRelationship?.financial !== undefined) {
          await dispatch(setSearchClient({ prop: 'searchClient', value: userData?.companyRelationship?.financial?.cif }))
          await dispatch(setFinancialtSelectedByCif({ prop: 'selectedFinancialId', value: userData?.companyRelationship?.financial?.id }))
          
          if (userType === EUserType.PAYER || userType === EUserType.BOTH) await dispatch(setFinancialExistsRelatedToClient({ prop: 'financialExistsRelatedToClient', value: true}))
          
        } else {
          await dispatch(setFinancialExistsRelatedToClient({ prop: 'financialExistsRelatedToClient', value: false}))
          await dispatch(setSearchClient({ prop: 'searchClient', value: '' }))
          await dispatch(setFinancialtSelectedByCif({ prop: 'selectedFinancialId', value: '' }))
        }

        if (userData && userData?.userType === EUserType.SUPPLIER && userData?.companyRelationship && userData?.companyRelationship !== undefined && userData?.companyRelationship?.customer && userData?.companyRelationship?.customer !== undefined) {
          await dispatch(setFinancialExistsRelatedToClient({ prop: 'financialExistsRelatedToClient', value: false}))
          await dispatch(setSearchClient({ prop: 'searchClient', value: userData?.companyRelationship?.customer?.cif }))
          await dispatch(setFinancialtSelectedByCif({ prop: 'selectedCustomerId', value: userData?.companyRelationship?.customer?.id }))
        }  
        
        if (userData && userData?.userType === EUserType.SUPPLIER && userData?.companyRelationship && userData?.companyRelationship === undefined){
          await dispatch(setFinancialExistsRelatedToClient({ prop: 'financialExistsRelatedToClient', value: false}))
          await dispatch(setSearchClient({ prop: 'searchClient', value: '' }))
          await dispatch(setFinancialtSelectedByCif({ prop: 'selectedCustomerId', value: '' }))
        }

        dispatch(setUserDataProps({ prop: 'dataUser', value: user }))
        dispatch(setUserDataProps({ prop: 'putDataUser', value: user }))
      }
    )
  )
  await dispatch(setUserDataProps({ prop: 'isLoadingGetSupplierMe', value: false }))
}

/** put */

export const apiPutUser = () => async (dispatch) => {
  await dispatch(setUserDataProps({ prop: 'isLoadingPutDataUser', value: true }))

  await dispatch(
    putUser(
      (tag, response) => {
        if (isDev()) console.log('apiPutUser - Error', response)
        ApiResponseValidationManager.putUser(response, dispatch, setUserDataProps)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPutUser'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiPutUser', response)
        document.getElementById('modal-open-updateOK')?.click()
      }
    )
  )

  await dispatch(setUserDataProps({ prop: 'isLoadingPutDataUser', value: false }))

  await dispatch(setUserDataProps({ prop: 'submitPut', value: false }))
}

export const validatePutUser = () => async (dispatch, getState) => {
  const { putDataUser } = getState().UserReducer
  const {
    firstName,
    lastName,
    email
  } = putDataUser
  const { country }: {country: ICountry} = getState().CountryReducer

  const error = FormValidationManager.formPutUserMe({
    firstName: firstName || '',
    lastName: lastName || '',
    email: email || '',
  })

  await dispatch(setUserDataProps({ prop: 'errorUserData', value: error }))
  return error
}

export const apiPutUserType = (email) => async (dispatch) => {
  await dispatch(setUserDataProps({ prop: 'isLoadingPutDataUser', value: true }))

  await dispatch(
    putUserType(
      email,
      (tag, response) => {
        if (isDev()) console.log('apiPutUserType - Error', response)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPutUser'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiPutUserType', response)
      }
    )
  )

  await dispatch(setUserDataProps({ prop: 'isLoadingPutDataUser', value: false }))

  await dispatch(setUserDataProps({ prop: 'submitPut', value: false }))
}

/** delete */

export const apiDeleteUser = () => async (dispatch) => {
  await dispatch(setUserDataProps({ prop: 'isLoadingDeleteSupplier', value: true }))

  await dispatch(
    delUser(
      (tag, response) => {
        if (isDev()) console.log('apiDeleteUser - Error', response)
      },
      (tag, response) => {
        if (isDev()) console.log('apiDeleteUser - Success', response)
        dispatch({ type: Types.CLEAR_USER_DATA })
        dispatch(clearLoginData())
        document.getElementById('modalDisplayDeleteItemOK')?.click()
      }
    )
  )

  await dispatch(setUserDataProps({ prop: 'isLoadingDeleteSupplier', value: false }))
}

/** patch */

export const apiPatchPaymentPreferences = () => async (dispatch, getState) => {
  await dispatch(setUserDataProps({ prop: 'isLoadingPatchPaymentPreferences', value: true }))
  const { putDataUser: { paymentPreferences, externalPayment } } = getState().UserReducer as IUserState

  await dispatch(
    patchPaymentPreferences(
      paymentPreferences,
      (tag, response) => {
        if (isDev()) console.log('apiPatchPaymentPreferences - Error', response)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiPatchPaymentPreferences', response)
        await dispatch(apiPostExternalPayment(externalPayment))
      }
    )
  )

  await dispatch(setUserDataProps({ prop: 'isLoadingPatchPaymentPreferences', value: false }))
}
