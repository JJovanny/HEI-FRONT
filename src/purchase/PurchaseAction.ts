import { approvePurchaseAdmin, getPpurchaseAdmin, getPurchase, getPurchaseAdmin, getPurchases, getPurchasesAdmin, postPurchase } from "src/api/purchase"
import Types from "./Types"
import Swal from "sweetalert2";

export const clearPurchase = () => async (dispatch) => {
  dispatch({ type: Types.CLEAR_PURCHASE })
}

export const set = ({ prop, value }) => ({
  type: Types.SET_PURCHASE,
  payload: { prop, value }
})

export const postPurchaseApi = (data, clear) => async (dispatch) => {
  await dispatch(
    postPurchase( 
      data,
      (tag, response) => {
       
      },
      (tag, response) => {
        Swal.fire({
            icon: 'success',
            title: 'Compra realizada con exito',
            text: 'Su compra ha sido enviada para ser aprobada!',
            confirmButtonText: 'Aceptar'
          });

          clear();
      }
    )
  )
}

export const getPurchaseApi = (id) => async (dispatch) => {
  await dispatch(
    getPurchase( 
      id,
      (tag, response) => {
       
      },
      (tag, response) => {
        dispatch(set({ prop: 'purchase', value: response?.data.purchase }))
      }
    )
  )
}

export const getPurchaseAdminApi = (id) => async (dispatch) => {
  await dispatch(
    getPurchaseAdmin( 
      id,
      (tag, response) => {
       
      },
      (tag, response) => {
        dispatch(set({ prop: 'purchase', value: response?.data.purchase }))
      }
    )
  )
}

export const approvePurchaseAdminApi = (id, approve) => async (dispatch) => {
  await dispatch(
    approvePurchaseAdmin( 
      id,
      approve,
      (tag, response) => {
       
      },
      (tag, response) => {
        dispatch(set({ prop: 'purchase', value: response?.data.purchase }))
      }
    )
  )
}


export const getPurchasesApi = () => async (dispatch) => {
  dispatch(set({ prop: 'loadingPurchase', value: true }))

  await dispatch(
    getPurchases( 
      (tag, response) => {
       
      },
      (tag, response) => {
        dispatch(set({ prop: 'purchases', value: response?.data.documents || [] }))
        dispatch(set({ prop: 'count', value: response?.data?.count || 0 }))
      }
    )
  )

  dispatch(set({ prop: 'loadingPurchase', value: false }))

}

export const getPurchasesApiAdmin = () => async (dispatch) => {
  dispatch(set({ prop: 'loadingPurchase', value: true }))

  await dispatch(
    getPpurchaseAdmin( 
      (tag, response) => {
       
      },
      (tag, response) => {
        dispatch(set({ prop: 'purchases', value: response?.data.documents || [] }))
        dispatch(set({ prop: 'count', value: response?.data?.count || 0 }))
      }
    )
  )

  dispatch(set({ prop: 'loadingPurchase', value: false }))

}

export const getPurchasesAdminApi = () => async (dispatch) => {
  await dispatch(
    getPurchasesAdmin( 
      (tag, response) => {
       
      },
      (tag, response) => {
        dispatch(set({ prop: 'purchases', value: response?.data.documents || [] }))
        dispatch(set({ prop: 'count', value: response?.data?.count || 0 }))
      }
    )
  )
}