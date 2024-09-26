import { Verbs, launchAsyncTask } from "../utils"
import { Tags } from "./tags"

export const getNotifications = (callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
  
    let url = '/api/v1/app/notification'
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
  
    url += '?sort=-createdAt'
    if (companyBranchSelected && companyBranchSelected?.id !== undefined) url += `&companyBranchSelected=${companyBranchSelected.id}`
  
    return dispatch(launchAsyncTask(Tags.GET_NOTIFICATIONS, Verbs.GET, url, config, null, callbackError, callbackSuccess))
  }


  export const putNotificationAll = (callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
    let id = ''
    if (companyBranchSelected && companyBranchSelected?.id !== undefined) id = companyBranchSelected.id  
    const url = '/api/v1/app/notification/all/'+ id
  
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
  
    const params = {
    }
  
    return dispatch(launchAsyncTask(Tags.PUT_NOTIFICATIONS, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
  }


  export const putNotification = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken, dataUser: { companyBranchSelected } } = getState().UserReducer
    const url = '/api/v1/app/notification/'+ id
  
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
  
    const params = {
      readIndividually: true,
    }
  
    return dispatch(launchAsyncTask(Tags.PUT_NOTIFICATIONS, Verbs.PUT, url, config, params, callbackError, callbackSuccess))
  }