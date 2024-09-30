import React from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { apiGetClient, apiGetCompanyInvoices } from 'src/client/ClientActions';
import { approvePurchaseAdminApi, getPurchaseAdminApi, getPurchaseApi, getPurchasesAdminApi, getPurchasesApiAdmin } from 'src/purchase/PurchaseAction';
import { useDispatch, useSelector } from 'src/redux/hooks';
import { IPurchaseState } from 'src/types/purchase';
import { IAdminUserState } from 'src/types/admin/user';
import Swal from 'sweetalert2';

export const TablePurchaseAdmin = ({ id, totalToPay, operationNumber, approved, createdAt, totalPts }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { purchase } = useSelector(state => state.PurchaseReducer as IPurchaseState);
  const { userData } = useSelector(state => state.AdminUserReducer as IAdminUserState);

  const handleRedirectClientProfile = async () => {
    await dispatch(getPurchaseAdminApi(id));
    document.getElementById('modal-open')?.click(); // Abre la modal
  };

  const handleApprove = async (id) => {
    if (approved) return;
    Swal.fire({
      title: '¿Deseas aprobar esta venta?',
      text: 'Esta acción es irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(approvePurchaseAdminApi(id, true));
          await dispatch(getPurchasesApiAdmin());
          Swal.fire(
            '¡Aprobado!',
            'La venta ha sido aprobada con éxito.',
            'success'
          );
        } catch (error) {
          Swal.fire(
            'Error',
            'Ocurrió un error al aprobar la venta.',
            'error'
          );
        }
      }
    });
  };

  const admin = userData.roles.includes('SUPER_ADMIN');

  return (
    <>
      <tr>
        <td onClick={() => handleRedirectClientProfile()}>{moment(createdAt).format('DD/MM/YYYY')}</td>
        <td onClick={() => handleRedirectClientProfile()}>
          <a className='text-heading font-semibold' style={{ cursor: 'pointer' }}>
            {operationNumber}
          </a>
        </td>
        <td onClick={() => handleRedirectClientProfile()}>
          <a className='text-heading font-semibold' style={{ cursor: 'pointer' }}>
            {totalToPay}
          </a>
        </td>
        <td onClick={() => handleRedirectClientProfile()}>
          <a className='text-heading font-semibold' style={{ cursor: 'pointer' }}>
            {totalPts}
          </a>
        </td>
        <td>
        <button  onClick={() => handleApprove(id)} className={approved ? 'text-heading font-semibold btn btn-sm btn-primary' : 'text-heading font-semibold btn btn-sm btn-secondary'} style={{ cursor: 'pointer' }}>
          {approved ? 'aprobada' : 'Aprobar'}
          </button>
        </td>
      </tr>

      {/* Modal de Bootstrap */}
      <div className="modal fade" id="purchaseModal" tabIndex={-1} aria-labelledby="purchaseModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content"> {/* Elimina el borde inferior */}
            <div className="modal-header">
              <h5 className="modal-title" id="purchaseModalLabel">Detalle de Compra</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* Detalles de la compra */}
              <h6><strong>Número de operación:</strong> {operationNumber}</h6>
              <h6><strong>Fecha:</strong> {moment(createdAt).format('DD/MM/YYYY')}</h6>
              <h6><strong>Total:</strong> ${totalToPay}</h6>
              <h6><strong>Total Puntos:</strong> {totalPts}</h6>
              <h6><strong>Estado:</strong> {approved ? 'Aprobada' : 'En espera'}</h6>

              {/* Lista de detalles de compra con scroll */}
              <h6 className="mt-3 mb-2">Detalles de la Compra:</h6>
              <ul className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}> {/* Ajusta la altura máxima */}
                {purchase && purchase.purchaseDetail && purchase.purchaseDetail.length > 0 ? (
                  purchase.purchaseDetail.map((detail) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={detail.id} style={{ padding: '15px 20px' }}>
                      <div>
                        <strong>Producto:</strong> {detail.product.name} <br />
                        <strong>Cantidad:</strong> {detail.amount} <br />
                        <strong>Total:</strong> ${detail.total} <br />
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No hay detalles de compra disponibles.</li>
                )}
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      <button id="modal-open" type="button" className="d-none" data-bs-toggle="modal" data-bs-target="#purchaseModal"></button>
    </>
  );
};
