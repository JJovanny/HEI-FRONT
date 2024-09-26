import Types from './Types'
import { getAdminUser } from 'src/api/admin/user'
import { isDev } from 'src/utils/Utils'
import toast from 'react-hot-toast'

export const clearAdminUserAccessToken = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_ADMIN_USER_ACCESS_TOKEN })
}

export const setAdminUserAccessToken = (response) => async (dispatch) => {
  dispatch({
    type: Types.SET_ADMIN_USER_ACCESS_TOKEN,
    payload: response
  })
}

export const setAdminUserLogout = () => async (dispatch) => {
  await dispatch({ type: Types.SET_ADMIN_USER_LOGOUT })
}

export const setAdminUserDataProps = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_ADMIN_USER_DATA_PROPS,
  payload: { prop, value }
})

export const apiGetAdminUser = (success?) => async (dispatch, getState) => {
  await dispatch(setAdminUserDataProps({ prop: 'isLoadingGetAdminUser', value: true }))

  await dispatch(
    getAdminUser(
      (tag, response) => {
        if (isDev()) console.log('apiGetAdminUser - Error', response)
        if (response?.message) toast.error(response.message)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetAdminUser', response)
        await dispatch(setAdminUserDataProps({ prop: 'userData', value: response?.data?.me }))
        if (success) success(response?.data?.me)
      }
    )
  )

  await dispatch(setAdminUserDataProps({ prop: 'isLoadingGetAdminUser', value: false }))
}
