import { postPurchase } from "src/api/purchase"
import Types from "./Types"
import Swal from "sweetalert2";

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