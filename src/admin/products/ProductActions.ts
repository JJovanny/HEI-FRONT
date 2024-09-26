import { getProducts, getProductsHome, getProductsUser, postOrPutProduct } from "src/api/product"
import Types from "./Types"


export const clearProducts = () => async (dispatch) => {
    dispatch({ type: Types.CLEAR })
  }

export const set = ({ prop, value }) => ({
    type: Types.SET,
    payload: { prop, value }
  })
 
export const apiGetProducts = () => async (dispatch, getState) => {
    await dispatch(set({ prop: 'loadingProduct', value: true }))
  
    await dispatch(
      getProducts(
        (tag, response) => {
        },
        (tag, response) => {
          dispatch(set({ prop: 'products', value: response?.data.documents || [] }))
          dispatch(set({ prop: 'count', value: response?.data?.count || 0 }))
        }
      )
    )
  
    await dispatch(set({ prop: 'loadingProduct', value: false }))
}

export const apiGetProductsUser = () => async (dispatch, getState) => {
  await dispatch(set({ prop: 'loadingProduct', value: true }))

  await dispatch(
    getProductsUser(
      (tag, response) => {
      },
      (tag, response) => {
        dispatch(set({ prop: 'products', value: response?.data.documents || [] }))
        dispatch(set({ prop: 'count', value: response?.data?.count || 0 }))
      }
    )
  )

  await dispatch(set({ prop: 'loadingProduct', value: false }))
}

export const apiGetProductsHome = () => async (dispatch, getState) => {
  await dispatch(set({ prop: 'loadingProduct', value: true }))

  await dispatch(
    getProductsHome(
      (tag, response) => {
      },
      (tag, response) => {
        dispatch(set({ prop: 'productsHome', value: response?.data.documents || [] }))
        dispatch(set({ prop: 'count', value: response?.data?.count || 0 }))
      }
    )
  )

  await dispatch(set({ prop: 'loadingProduct', value: false }))
}

export const postPutProduct = (data) => async (dispatch) => {

  await dispatch(
    postOrPutProduct( 
      data,
      (tag, response) => {
       
      },
      (tag, response) => {

      }
    )
  )
}