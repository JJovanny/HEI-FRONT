import React from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { apiGetClient, apiGetCompanyInvoices } from 'src/client/ClientActions';
import { getPurchaseApi } from 'src/purchase/PurchaseAction';
import { useDispatch, useSelector } from 'src/redux/hooks';
import { IPurchaseState } from 'src/types/purchase';
import { IUserState } from 'src/types/user';
import { EUserType } from 'src/types/enums';
import { IAdminUserState } from 'src/types/admin/user';

export const TablePurchase = ({ id, totalToPay, operationNumber, approved, createdAt, totalPts }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { purchase } = useSelector(state => state.PurchaseReducer as IPurchaseState);
  const { userData } = useSelector(state => state.AdminUserReducer as IAdminUserState);

  const handleRedirectClientProfile = async () => {
    await dispatch(getPurchaseApi(id));
    document.getElementById('modal-open')?.click(); // Abre la modal
  };

  const admin = userData.roles.includes('SUPER_ADMIN');
 
  return (
    <>
      <tr onClick={() => handleRedirectClientProfile()}>
        <td>{moment(createdAt).format('DD/MM/YYYY')}</td>
        <td>
          <a className='text-heading font-semibold' style={{ cursor: 'pointer' }}>
            {operationNumber}
          </a>
        </td>
        <td>
          <a className='text-heading font-semibold' style={{ cursor: 'pointer' }}>
            {totalToPay}
          </a>
        </td>
        <td>
          <a className='text-heading font-semibold' style={{ cursor: 'pointer' }}>
            {totalPts}
          </a>
        </td>
        <td>
          <a className={approved ? 'text-heading font-semibold text-primary' : 'text-heading font-semibold text-secondary'} style={{ cursor: 'pointer' }}>
            {approved ? 'aprobada' : 'En espera'}
          </a>
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
