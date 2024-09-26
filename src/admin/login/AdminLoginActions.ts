import toast from 'react-hot-toast'
import { apiGetAdminUser, setAdminUserAccessToken, setAdminUserLogout } from '../user/AdminUserActions'
import { postAdminUserConfirmLogin, postAdminUserRequestLogin, postResetAdminPassord } from 'src/api/admin/auth'
import FormValidationManager from '../../utils/managers/FormValidationManager'
import { strings } from '../../resources/locales/i18n'
import { isDev } from '../../utils/Utils'
import Types from './Types'
import { setUserLogout } from 'src/user/UserActions'
import { setLoginState } from 'src/login/LoginActions'

export const clearAdminLoginData = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ADMIN_LOGIN_DATA })
}

export const clearAdminLoginDataError = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ADMIN_LOGIN_DATA_ERROR })
}

export const setAdminLoginState = ({ prop, value }) => ({
  type: Types.SET_ADMIN_LOGIN_STATE,
  payload: { prop, value }
})

export const setValuePostDataAdminLogin = ({ prop, value }) => ({
  type: Types.SET_VALUE_POST_DATA_ADMIN_LOGIN,
  payload: { prop, value }
})
 

export const apiPostAdminResetPassord = (password, redirect) => async (dispatch,getState) => {
  await dispatch(setAdminLoginState({ prop: 'isLoadingPostDataLogin', value: true }))

  await dispatch(
    postResetAdminPassord(
      password,
      (tag, response) => {
        if (isDev()) console.log('postLogin - Error', response)
        dispatch(setAdminLoginState({ prop: 'errorLoginData', value: [{ key: 'verificationCode', value: response?.message }] }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPostLogin'))
      },
      async (tag, response) => {
        if (isDev()) console.log('postLogin', response)
        if (response) {
          dispatch(clearAdminLoginData())
          // dispatch(setAdminUserLogout())
          dispatch(setAdminLoginState({ prop: 'hps', value: true }))
          dispatch(setAdminLoginState({ prop: 'submitPost', value: false }))
          redirect()
          toast.success(strings('forgetPassword.title'))
        }
      }
    )
  )

  await dispatch(setLoginState({ prop: 'isLoadingPostDataLogin', value: false }))
}

export const postAdminUserRequestEmailLogin = (email, password, enterByCode, redirectVerifyCode, redirectDashboard) => async (dispatch) => {
  await dispatch(clearAdminLoginDataError())
  await dispatch(setAdminLoginState({ prop: 'isLoadingPostDataLogin', value: true }))

  await dispatch(
    postAdminUserRequestLogin(
      email, 
      password,
      enterByCode,
      (tag, response) => {
        if (isDev()) console.log('postAdminUserRequestEmailLogin - Error', response)
        dispatch(setAdminLoginState({ prop: 'errorLoginData', value: [{ key: 'email', value: response.data.message }] }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorSendLoginEmail'))
      }, 
      async  (tag, response) => {
        if (isDev()) console.log('postAdminUserRequestEmailLogin', response)
        dispatch(setAdminLoginState({ prop: 'submitPost', value: false }))
        if (response) {
          dispatch(setAdminUserAccessToken(response))
          if (enterByCode) {
            redirectVerifyCode();
          } else {
            redirectDashboard();
          }
        }
      }
    )
  )

  await dispatch(setAdminLoginState({ prop: 'isLoadingPostDataLogin', value: false }))
}

export const validatePostAdminRequestLogin = () => async (dispatch, getState) => {
  const { postDataLogin } = getState().AdminLoginReducer
  const { email } = postDataLogin

  const error = FormValidationManager.formRequestLogin({
    email
  })

  await dispatch(setAdminLoginState({ prop: 'errorLoginData', value: error }))
  return error
}

export const postAdminUserLogin = (postDataLogin, redirect) => async (dispatch) => {
  await dispatch(clearAdminLoginDataError())
  await dispatch(setAdminLoginState({ prop: 'isLoadingPostDataLogin', value: true }))

  await dispatch(
    postAdminUserConfirmLogin(
      postDataLogin,
      (tag, response) => {
        if (isDev()) console.log('postAdminUserLogin - Error', response)
        dispatch(setAdminLoginState({ prop: 'errorLoginData', value: [{ key: 'verificationCode', value: response?.message }] }))
        if (response?.message) {
          toast.error(response.message)
        } else toast.error(strings('toasts.alert.errorPostLogin'))
      },
      (tag, response) => {
        if (isDev()) console.log('postAdminUserLogin', response)
        dispatch(setAdminUserAccessToken(response))
        // dispatch(clearAdminLoginData())
        dispatch(setUserLogout())
        redirect()
      }
    )
  )

  await dispatch(setAdminLoginState({ prop: 'isLoadingPostDataLogin', value: false }))
}

export const validatePostAdminConfirmLogin = () => async (dispatch, getState) => {
  const { postDataLogin } = getState().AdminLoginReducer
  const { email, verificationCode } = postDataLogin

  const error = FormValidationManager.formConfirmLogin({
    email,
    verificationCode
  })

  await dispatch(setAdminLoginState({ prop: 'errorLoginData', value: error }))
  return error
}
