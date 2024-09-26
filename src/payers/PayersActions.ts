import Types from './Types'
import { isDev } from '../utils/Utils'
import { getMyFinancialCompanies } from 'src/api/payers'

export const setPayersState = ({ prop, value }: { prop, value }) => ({
  type: Types.SET_PAYERS_STATE,
  payload: { prop, value }
})

export const apiGetMyFinancialCompanies = () => async (dispatch) => {
  await dispatch(setPayersState({ prop: 'isLoadingGetMyFinancialCompanies', value: true }))
  await dispatch(
    getMyFinancialCompanies(
      (tag, response) => {
        if (isDev()) console.log('apiGetMyFinancialCompanies - Error', response)
      },
      async (tag, response) => {
        if (isDev()) console.log('apiGetMyFinancialCompanies - Success', response)
        await dispatch(setPayersState({ prop: 'financialCompanies', value: response?.data?.documents }))
      }
    )
  )
  await dispatch(setPayersState({ prop: 'isLoadingGetMyFinancialCompanies', value: false }))
}
