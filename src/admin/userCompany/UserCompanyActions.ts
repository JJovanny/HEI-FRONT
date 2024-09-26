import Types from './Types'
import CountryManager from 'src/country/CountryManager'
import { ICountry } from 'src/types/country'
import FormValidationManager from 'src/utils/managers/FormValidationManager'
import { IUserCompanyList, IUserCompanyState } from 'src/types/admin/userCompany'
import { isDev } from 'src/utils/Utils'
import toast from 'react-hot-toast'
import { strings } from 'src/resources/locales/i18n'
import { delUserCompany, getMyUsersCompany, getUserCompanyById, postUserCompany, postUserD, putUserCompany } from 'src/api/admin/userCompany'
import { clearClients, setClientSelectedByCif, setFinancialtSelectedByCif, setSearchClient, setSupplierSelected } from 'src/client/ClientActions'
import { Console } from 'console'
import { setAdminUserDataProps } from '../user/AdminUserActions'

export const setUserCompanyDataProps = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_USER_COMPANY_DATA_PROPS,
  payload: { prop, value }
})

export const setValuePostUserCompany = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_VALUE_POST_USER_COMPANY,
  payload: { prop, value }
})

export const setValuePutUserCompany = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_VALUE_PUT_USER_COMPANY,
  payload: { prop, value }
})

export const setValuePutUser = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_VALUE_PUT_USER_DATA,
  payload: { prop, value }
})

export const setValuePutCompany = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_VALUE_PUT_COMPANY_DATA,
  payload: { prop, value }
})

export const clearPostUserCompanyData = () => ({ type: Types.CLEAR_POST_DATA_USER_COMPANY })

export const clearErrorPostUserCompany = () => ({ type: Types.CLEAR_ERROR_POST_USER_COMPANY })

export const clearPutUserCompanyData = () => ({ type: Types.CLEAR_PUT_DATA_USER_COMPANY })

export const clearErrorPutUserCompany = () => ({ type: Types.CLEAR_ERROR_PUT_USER_COMPANY })

export const clearUserCompanyData = () => ({ type: Types.CLEAR_USER_COMPANY_DATA })


export const validatePutUserCompany = () => async (dispatch, getState) => {
  const { editUserCompanyDetails, userCompanyDetails } = getState().UserCompanyReducer as IUserCompanyState
  const { country }: {country: ICountry} = getState().CountryReducer
  const regionRequired = CountryManager.getCountryRegions(country).length > 0

  const error = FormValidationManager.formPutUserCompany({
    newData: editUserCompanyDetails,
    originalData: userCompanyDetails,
    regionRequired
  })

  await dispatch(setUserCompanyDataProps({ prop: 'errorEditUserCompany', value: error }))
  return error
}

export const validatePutUserCompanyButton = (editUserCompanyDetails, userCompanyDetails) => {
  if (editUserCompanyDetails?.userData?.email !== userCompanyDetails?.email) return false
  if (editUserCompanyDetails?.userData?.firstname !== userCompanyDetails?.firstName) return false
  if (editUserCompanyDetails?.userData?.lastname !== userCompanyDetails?.lastName) return false
  if (editUserCompanyDetails?.userData?.phoneNumber !== userCompanyDetails?.phoneNumber) return false
  if (editUserCompanyDetails?.userData?.userType !== userCompanyDetails?.userType) return false
  if (editUserCompanyDetails?.editCompany) {
    if (editUserCompanyDetails?.userData?.company?.address !== userCompanyDetails?.company.address) return false
    if (editUserCompanyDetails?.userData?.company?.cif !== userCompanyDetails?.company.cif) return false
    if (editUserCompanyDetails?.userData?.company?.city !== userCompanyDetails?.company.city) return false
    if (editUserCompanyDetails?.userData?.company?.name !== userCompanyDetails?.company.name) return false
    if (editUserCompanyDetails?.userData?.company?.postalCode !== userCompanyDetails?.company.postalCode) return false
    if (editUserCompanyDetails?.userData?.company?.country !== userCompanyDetails?.company.country?.code) return false
    if (editUserCompanyDetails?.userData?.company?.region !== userCompanyDetails?.company.region) return false
  }

  return true
}

export const apiPostUserCompany = () => async (dispatch) => {
  await dispatch(setUserCompanyDataProps({ prop: 'isLoadingPostUserCompany', value: true }))

  await dispatch(
    postUserCompany(
      (tag, response) => {
        if (isDev()) console.log('apiPostUserCompany - Error', response)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.adminAlert.createUserCompany'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiPostUserCompany', response)
        await dispatch(setClientSelectedByCif({ prop: 'selectedCustomerId', value: '' }))
        await dispatch(setFinancialtSelectedByCif({ prop: 'selectedFinancialId', value: '' }))
        await dispatch(setSearchClient({ prop: 'selectedCustomerId', value: '' }))
        await dispatch(clearClients({ prop: 'clients', value: [] }))
        document.getElementById('modal-open-successOK')?.click()
      }
    )
  )

  await dispatch(setUserCompanyDataProps({ prop: 'isLoadingPostUserCompany', value: false }))

  await dispatch(setUserCompanyDataProps({ prop: 'submitPost', value: false }))
}

export const apiPostUserD = () => async (dispatch) => {
  await dispatch(
    postUserD(
      (tag, response) => {
        if (isDev()) console.log('apiPostUserCompany - Error', response)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.adminAlert.createUserCompany'))
      },
      async (tag, response) => {
        if (isDev()) console.log('apiPostUserCompany', response)
        await dispatch(setClientSelectedByCif({ prop: 'selectedCustomerId', value: '' }))
        await dispatch(setFinancialtSelectedByCif({ prop: 'selectedFinancialId', value: '' }))
        await dispatch(setSearchClient({ prop: 'selectedCustomerId', value: '' }))
        await dispatch(clearClients({ prop: 'clients', value: [] }))
        document.getElementById('modal-open-successOK')?.click()
      }
    )
  )

  await dispatch(setUserCompanyDataProps({ prop: 'isLoadingPostUserCompany', value: false }))

  await dispatch(setUserCompanyDataProps({ prop: 'submitPost', value: false }))
}

export const apiPutUserCompany = () => async (dispatch) => {
  await dispatch(setUserCompanyDataProps({ prop: 'isLoadingPutUserCompany', value: true }))

  await dispatch(
    putUserCompany(
      (tag, response) => {
        if (isDev()) console.log('putUserCompany - Error', response)
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.adminAlert.createUserCompany'))
      },
      async (tag, response) => {
        if (isDev()) console.log('putUserCompany', response)
        document.getElementById('modal-open-successOK')?.click()
      }
    )
  )

  await dispatch(setUserCompanyDataProps({ prop: 'isLoadingPutUserCompany', value: false }))

  await dispatch(setUserCompanyDataProps({ prop: 'submitPut', value: false }))
}

export const apiDeleteUserCompany = () => async (dispatch) => {
  await dispatch(setUserCompanyDataProps({ prop: 'isLoadingDelUserCompany', value: true }))

  await dispatch(
    delUserCompany(
      (tag, response) => {
        if (isDev()) console.log('apiDeleteUserCompany - Error', response)
        toast.error(strings('toasts.alert.errorPostDeleteUser'))
      },
      (tag, response) => {
        if (isDev()) console.log('apiDeleteUserCompany - Success', response)
        dispatch(clearUserCompanyData())
        document.getElementById('modalDisplayDeleteItemOK')?.click()
      }
    )
  )

  await dispatch(setUserCompanyDataProps({ prop: 'isLoadingDelUserCompany', value: false }))
}

export const apiGetMyUsersCompany = () => async (dispatch) => {
  await dispatch(setUserCompanyDataProps({ prop: 'isLoadingGetMyUsersCompany', value: true }))

  await dispatch(
    getMyUsersCompany(
      (tag, response) => {
        if (isDev()) console.log('apiGetMyUsersCompany - Error', response)
        if (response?.message) toast.error(response.message)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetMyUsersCompany', response)
        await dispatch(setAdminUserDataProps({ prop: 'count', value: response.data?.count || 0 }))
        await dispatch(setUserCompanyDataProps({ prop: 'myUsersCompany', value: response?.data?.users || [] }))
      }
    )
  )

  await dispatch(setUserCompanyDataProps({ prop: 'isLoadingGetMyUsersCompany', value: false }))

  await dispatch(setUserCompanyDataProps({ prop: 'submitPost', value: false }))
}

export const apiGetUserCompanyById = (id:string) => async (dispatch) => {
  await dispatch(setUserCompanyDataProps({ prop: 'isLoadingGetUserCompanyById', value: true }))

  await dispatch(
    getUserCompanyById(
      id,
      (tag, response) => {
        if (isDev()) console.log('apiGetUserCompanyById - Error', response)
        if (response?.message) toast.error(response.message)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetUserCompanyById', response)
        await dispatch(setUserCompanyDataProps({ prop: 'userCompanyDetails', value: response?.data?.user }))
        await dispatch(getEditUserCompany(response?.data?.user))
      }
    )
  )

  await dispatch(setUserCompanyDataProps({ prop: 'isLoadingGetUserCompanyById', value: false }))

  await dispatch(setUserCompanyDataProps({ prop: 'submitPost', value: false }))
  await dispatch(setUserCompanyDataProps({ prop: 'submitPut', value: false }))
}

export const getEditUserCompany = (userCompany: IUserCompanyList) => async (dispatch) => {
  const convert = {
    userId: userCompany?.id,
    editCompany: false,
    userData: {
      email: userCompany?.email,
      firstname: userCompany?.firstName,
      lastname: userCompany?.lastName,
      phoneNumber: userCompany?.phoneNumber,
      userType: userCompany?.userType,
      ci: userCompany?.ci,
      ciInvitation: userCompany?.ciInvitation,
      company: {
        address: userCompany?.company?.address,
        cif: userCompany?.company?.cif,
        city: userCompany?.company?.city,
        country: userCompany?.company?.country?.code,
        typeCompany: userCompany?.company?.typeCompany,
        financialCompany: userCompany?.company?.financialCompany,
        name: userCompany?.company?.name,
        postalCode: userCompany?.company?.postalCode,
        region: userCompany?.company?.region
      }
    }
  }
  await dispatch(setUserCompanyDataProps({ prop: 'editUserCompanyDetails', value: convert }))
}
