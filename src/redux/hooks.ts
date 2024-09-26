import { shallowEqual, useDispatch as useDispatchBase, useSelector as useSelectorBase } from 'react-redux'
import { AppThunkDispatch, RootState } from './store'

export const useDispatch = () => useDispatchBase<AppThunkDispatch>()

export const useSelector = <TSelected = unknown>(
  selector: (state: RootState) => TSelected
): TSelected => useSelectorBase<RootState, TSelected>(selector, shallowEqual)
