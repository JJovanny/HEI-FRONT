import toast from 'react-hot-toast'

// actions
import { setUserAccessToken, apiGetUserMe, setUserLogout } from '../user/UserActions'
// api
import { postRequestLogin, postConfirmLogin, postRefreshToken, postResetPassord, postFetchLogin, postResetPin, postConfirmPin } from 'src/api/auth'
import FormValidationManager from '../utils/managers/FormValidationManager'
// resources
import { strings } from '../resources/locales/i18n'
import { isDev } from '../utils/Utils'
// resources
import Types from './Types'
import { setAdminUserLogout } from 'src/admin/user/AdminUserActions'

export const clearLoginData = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_LOGIN_DATA })
}

export const clearLoginDataError = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_LOGIN_DATA_ERROR })
}

export const setLoginState = ({ prop, value }) => ({
  type: Types.SET_LOGIN_STATE,
  payload: { prop, value }
})

export const setValuePostDataLogin = ({ prop, value }) => ({
  type: Types.SET_VALUE_POST_DATA_LOGIN,
  payload: { prop, value }
})

export const postRequestEmailLogin = (email, password, enterByCode, redirectVerifyCode,redirectInvoices) => async (dispatch) => {
  await dispatch(clearLoginDataError())
  await dispatch(setLoginState({ prop: 'isLoadingPostDataLogin', value: true }))

  await dispatch(
    postRequestLogin(
      email,
      password,
      enterByCode,
      async (tag, response) => {
        if (isDev()) console.log('postRequestLogin - Error', response)
        dispatch(setLoginState({ prop: 'errorLoginData', value: [{ key: 'email', value: response.data.message }] }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.credentialsInvalid'))
      },
      async (tag, response) => {
        if (isDev()) console.log('postRequestLogin', response)
        dispatch(setLoginState({ prop: 'submitPost', value: false }))
        if (response) {
          if (enterByCode) {
            redirectVerifyCode();
          } else {
            dispatch(setUserAccessToken(response));
            dispatch(clearLoginData());
            dispatch(setAdminUserLogout());
            await dispatch(apiGetUserMe());
            dispatch(setLoginState({ prop: 'submitPost', value: false }));
            redirectInvoices();
          }
        }
      }
    )
  )

  await dispatch(setLoginState({ prop: 'isLoadingPostDataLogin', value: false }))
}


export const validatePostRequestLogin = () => async (dispatch, getState) => {
  const { postDataLogin } = getState().LoginReducer
  const { email } = postDataLogin

  const error = FormValidationManager.formRequestLogin({
    email
  })

  await dispatch(setLoginState({ prop: 'errorLoginData', value: error }))
  return error
}

export const postLogin = (postDataLogin, redirect) => async (dispatch) => {
  await dispatch(clearLoginDataError())
  await dispatch(setLoginState({ prop: 'isLoadingPostDataLogin', value: true }))

  await dispatch(
    postConfirmLogin(
      postDataLogin,
      (tag, response) => {
        if (isDev()) console.log('postLogin - Error', response)
        dispatch(setLoginState({ prop: 'errorLoginData', value: [{ key: 'verificationCode', value: response?.message }] }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPostLogin'))
      },
      async (tag, response) => {
        if (isDev()) console.log('postLogin', response)
        dispatch(setUserAccessToken(response))
        /** Método cargar facturas */
        dispatch(clearLoginData())
        dispatch(setAdminUserLogout())
        await dispatch(apiGetUserMe())
        dispatch(setLoginState({ prop: 'submitPost', value: false }))
        redirect()
      }
    )
  )

  await dispatch(setLoginState({ prop: 'isLoadingPostDataLogin', value: false }))
}

export const postPin = (pin, id, handleResponse) => async (dispatch) => {

  await dispatch(
    postConfirmPin(
      pin,
      id,
      (tag, response) => {
        handleResponse(false, response);
      },
      async (tag, response) => {
        handleResponse(true, response);
      }
    )
  )

}

export const apiPostResetPassord = (password, redirect) => async (dispatch,getState) => {
  await dispatch(clearLoginDataError())
  await dispatch(setLoginState({ prop: 'isLoadingPostDataLogin', value: true }))

  await dispatch(
    postResetPassord(
      password,
      (tag, response) => {
        if (isDev()) console.log('postLogin - Error', response)
        dispatch(setLoginState({ prop: 'errorLoginData', value: [{ key: 'verificationCode', value: response?.message }] }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPostLogin'))
      },
      async (tag, response) => {
        if (isDev()) console.log('postLogin', response)
        if (response) {
          dispatch(clearLoginData())
          dispatch(setAdminUserLogout())
          await dispatch(apiGetUserMe())
          dispatch(setLoginState({ prop: 'hps', value: true }))
          dispatch(setLoginState({ prop: 'submitPost', value: false }))
          redirect()
          toast.success(strings('forgetPassword.title'))
        }
      }
    )
  )

  await dispatch(setLoginState({ prop: 'isLoadingPostDataLogin', value: false }))
}

export const apiPostResetPin = (pin, redirect) => async (dispatch,getState) => {
  await dispatch(clearLoginDataError())
  await dispatch(setLoginState({ prop: 'isLoadingPostDataLogin', value: true }))

  await dispatch(
    postResetPin(
      pin,
      (tag, response) => {
      },
      async (tag, response) => {
        if (response) {
          redirect()
          toast.success(strings('placeholder.pinChanged'))
        }
      }
    )
  )

  await dispatch(setLoginState({ prop: 'isLoadingPostDataLogin', value: false }))
}

export const apiPostLogin = (password, email, redirect) => async (dispatch,getState) => {
  await dispatch(clearLoginDataError())
  await dispatch(setLoginState({ prop: 'isLoadingPostDataLogin', value: true }))

  await dispatch(
    postFetchLogin(
      password,
      email,
      (tag, response) => {
        if (isDev()) console.log('postLogin - Error', response)
        dispatch(setLoginState({ prop: 'errorLoginData', value: [{ key: 'verificationCode', value: response?.message }] }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.credentialsInvalid'))
      },
      async (tag, response) => {
        if (response) {
          dispatch(setUserAccessToken(response))
          dispatch(setAdminUserLogout())
          await dispatch(apiGetUserMe())
          dispatch(setLoginState({ prop: 'submitPost', value: false }))
          redirect()
        }
      }
    )
  )

  await dispatch(setLoginState({ prop: 'isLoadingPostDataLogin', value: false }))
}

export const validatePostConfirmLogin = () => async (dispatch, getState) => {
  const { postDataLogin } = getState().LoginReducer
  const { email, verificationCode } = postDataLogin

  const error = FormValidationManager.formConfirmLogin({
    email,
    verificationCode
  })

  await dispatch(setLoginState({ prop: 'errorLoginData', value: error }))
  return error
}

export const apiRefreshToken = (callbackSuccess) => async (dispatch) => {
  await dispatch(
    postRefreshToken(
      (tag, response) => {
        if (isDev()) console.log('apiRefreshToken - Error: ', response)
        dispatch(setUserLogout())
        if (response.message) toast.error(response.message)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiRefreshToken - Success: ', response)

        await dispatch(setUserAccessToken(response))

        const config = {
          headers: {
            Authorization:
              response && response.data.accessToken ? 'Bearer ' + response.data.accessToken : '',
            'Content-Type': 'application/json'
          }
        }

        if (callbackSuccess) callbackSuccess(config)
      }
    )
  )
}
