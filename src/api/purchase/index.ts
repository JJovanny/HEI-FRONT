import { Verbs, launchAsyncTask } from '../utils'
import { Tags } from './tags'



export const postPurchase = (props, callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken } = getState().UserReducer

    const url = '/api/v1/app/purchase'
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
  
    const params = props
  
    return dispatch(launchAsyncTask(Tags.POST_PURCHASE, Verbs.POST, url, config, params, callbackError, callbackSuccess))
  }


  export const getPurchaseAdmin = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken } = getState().AdminUserReducer

    const url = '/api/v1/app/purchase/admin/'+id
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
    
    return dispatch(launchAsyncTask(Tags.GET_PURCHASE, Verbs.GET, url, config, {}, callbackError, callbackSuccess))
  }

  export const approvePurchaseAdmin = (id, approve, callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken } = getState().AdminUserReducer

    const url = '/api/v1/app/purchase/admin/approve/'+id
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
    
    return dispatch(launchAsyncTask(Tags.POST_PURCHASE, Verbs.POST, url, config, {approved: approve}, callbackError, callbackSuccess))
  }

  export const getPurchase = (id, callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken } = getState().UserReducer

    const url = '/api/v1/app/purchase/'+id
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
    
    return dispatch(launchAsyncTask(Tags.GET_PURCHASE, Verbs.GET, url, config, {}, callbackError, callbackSuccess))
  }

  export const getPpurchaseAdmin = (callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken } = getState().AdminUserReducer

    const url = '/api/v1/app/adminUser/purchases'
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
    
    return dispatch(launchAsyncTask(Tags.GET_PURCHASE, Verbs.GET, url, config, null, callbackError, callbackSuccess))
  }

  export const getPurchasesAdmin = (callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken } = getState().AdminUserReducer

    const url = '/api/v1/app/purchase/admins'
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
    
    return dispatch(launchAsyncTask(Tags.GET_PURCHASE, Verbs.GET, url, config, null, callbackError, callbackSuccess))
  }

  export const getPurchases = (callbackError, callbackSuccess) => async (dispatch, getState) => {
    const { accessToken } = getState().UserReducer

    const url = '/api/v1/app/purchase'
    const config = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
    
    return dispatch(launchAsyncTask(Tags.GET_PURCHASE, Verbs.GET, url, config, {}, callbackError, callbackSuccess))
  }
