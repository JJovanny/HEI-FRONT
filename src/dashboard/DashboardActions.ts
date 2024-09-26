import Types from './Types'
import { isDev } from '../utils/Utils'
import { getDashboard } from '../api/dashboard'

export const apiGetDashboard = () => async (dispatch) => {
  dispatch(setDashboardState('isLoadingGetDashboard', true))

  await dispatch(
    getDashboard(
      (tag, response) => {
        if (isDev()) console.log('apiDashboard - Error: ', response)
        dispatch({
          type: Types.GET_DASHBOARD_METRICS_FAIL,
          payload: response
        })
      },
      (tag, response) => {
        if (isDev()) console.log('apiDashboard - Success: ', response)

        dispatch({
          type: Types.GET_DASHBOARD_METRICS_SUCCESS,
          payload: response
        })
      }
    )
  )

  dispatch(setDashboardState('isLoadingGetDashboard', false))
}

export const clearDataDashboard = () => ({
  type: Types.CLEAR_DATA_DASHBOARD
})

export const setDashboardState = (prop, value) => ({
  type: Types.SET_DASHBOARD_STATE,
  payload: { prop, value }
})
