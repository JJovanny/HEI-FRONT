import { launchAsyncTask, Verbs } from 'src/api/utils'
import { EditUserDTO, IUserCompanyState } from 'src/types/admin/userCompany'
import { isDev } from 'src/utils/Utils'
import { Tags } from './tags'
import { EUserType, TypeCompany } from 'src/types/enums'

export const postUserCompany = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer
  const financialCompanyID = isDev() ? '6465c50193228081fdd40070' : '6480925080137722c3b6ddd4'
  const { selectedCustomerId, selectedFinancialId } = getState().ClientReducer

  const { userCompanyData } = getState().UserCompanyReducer as IUserCompanyState
  const {
    firstname,
    lastname,
    phoneNumber,
    userType,
    email,
    ci,
    ciInvitation,
    password
  } = userCompanyData

  const url = `/api/v1/app/adminUser/user/${financialCompanyID}`
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const params = {
    email,
    firstname,
    lastname,
    phoneNumber: phoneNumber || undefined,
    userType: userType,
    ci,
    ciInvitation,
    password
  }

  return dispatch(launchAsyncTask(Tags.POST_USER_COMPANY, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const postUserD = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().UserReducer
  const url = `/api/v1/app/adminUser/u-d`
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const params = {}
  return dispatch(launchAsyncTask(Tags.POST_USER_COMPANY, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}

export const putUserCompany = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer

  const { editUserCompanyDetails, userCompanyDetails } = getState().UserCompanyReducer as IUserCompanyState
  const { selectedFinancialId, selectedCustomerId } = getState().ClientReducer

  const url = '/api/v1/app/adminUser/edit-user'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const params = {
    userId: editUserCompanyDetails?.userId,
    userData: {
      password: editUserCompanyDetails?.userData?.password || undefined,
      ci: editUserCompanyDetails?.userData?.ci,
      ciInvitation: editUserCompanyDetails?.userData?.ciInvitation,
      email: editUserCompanyDetails?.userData?.email !== userCompanyDetails?.email ? editUserCompanyDetails?.userData?.email : undefined,
      firstname: editUserCompanyDetails?.userData?.firstname !== userCompanyDetails?.firstName ? editUserCompanyDetails?.userData?.firstname : undefined,
      lastname: editUserCompanyDetails?.userData?.lastname !== userCompanyDetails?.lastName ? editUserCompanyDetails?.userData?.lastname : undefined,
      phoneNumber: editUserCompanyDetails?.userData?.phoneNumber !== userCompanyDetails?.phoneNumber ? editUserCompanyDetails?.userData?.phoneNumber : undefined,
      userType: editUserCompanyDetails?.userData?.userType !== userCompanyDetails?.userType ? editUserCompanyDetails?.userData?.userType : undefined,
  }
}

 
  return dispatch(launchAsyncTask(Tags.PUT_USER_COMPANY, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
}

export const getMyUsersCompany = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken, page, limit, } = getState().AdminUserReducer
  
  let url = '/api/v1/app/adminUser/users'

  if (page > 0) url += '?page=' + page
  if (limit > 0) url += '&limit=' + limit

  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_USERS_COMPANY, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const getUserCompanyById = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer

  const url = `/api/v1/app/adminUser/users/${id}`
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  return dispatch(launchAsyncTask(Tags.GET_USER_COMPANY_BY_ID, Verbs.GET, url, config, null, callbackError, callbackSuccess))
}

export const delUserCompany = (callbackError, callbackSuccess) => async (dispatch, getState) => {
  const { accessToken } = getState().AdminUserReducer
  const { userCompanyDetails } = getState().UserCompanyReducer as IUserCompanyState

  const url = '/api/v1/app/adminUser/remove-user'
  const config = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    }
  }

  const params = {
    userId: userCompanyDetails.id
  }

  return dispatch(launchAsyncTask(Tags.DEL_USER_COMPANY, Verbs.POST, url, config, params, callbackError, callbackSuccess))
}
