import { strings } from 'src/resources/locales/i18n'
import Loading from 'ui/Loading'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetSupplierClients, clearClientsData, clearClientsFilters, setClientDataProps } from 'src/client/ClientActions'
import { useEffect, useState } from 'react'
import { UserFilter } from 'components/filter/UserFilter'
import { NotFound } from 'ui/NotFound'
import { apiGetUserMe, postUser } from 'src/user/UserActions'
import { getPurchasesApi } from 'src/purchase/PurchaseAction'
import { TablePurchase } from './TablePurchase'
import { IPurchaseState } from 'src/types/purchase'

export const PurchaseList = () => {
  const dispatch = useDispatch()
  const { purchases, loadingPurchase } = useSelector(state => state.PurchaseReducer as IPurchaseState)

  useEffect(() => {
    dispatch(getPurchasesApi())
    dispatch(apiGetUserMe())
    return () => {}
  }, [])


  return (
    <main className='py-5 py-lg-8 bg-surface-secondary'>
      {/* <!-- Container --> */}
      <div className='container-xl'>
        <div className='mt-n56 position-relative z-index-100'>

          <div className='card rounded shadow overflow-hidden'>
            <div className='card-body p-0'>

              <div className='row g-0'>
                {/* <div className='col-md-4 col-xl-3 filters h-100 p-4 p-md-5 p-xl-7 border-end-md border-bottom border-bottom-md-0'>
                  <UserFilter areSuppliers={false} />
                </div> */}
                <div className='col-md-12 col-xl-12 h-100'>
                  <div className='table-responsive'>
                    <table className='table table-hover table-nowrap'>
                      <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
                        <tr>
                        <th scope='col'>Fecha</th>
                        <th scope='col'>Numero de operacion</th>
                          <th scope='col'>Total pagado</th>
                          <th scope='col'>Total Puntos</th>
                          <th scope='col'>Aprobada</th>
                        </tr>
                      </thead>
                      <tbody style={{ cursor: 'pointer' }}>
                        {(!loadingPurchase && purchases && Array.isArray(purchases)) && purchases?.map((purchase) =>
                          <TablePurchase
                            key={purchase?.id}
                            id={purchase?.id}
                            totalPts={purchase?.totalPts}
                            totalToPay={purchase?.totalToPay}
                            operationNumber={purchase?.operationNumber}
                            approved={purchase?.approved}
                            createdAt={purchase?.createdAt}
                          />)}
                      </tbody>
                    </table>
                    {purchases?.length === 0 && !loadingPurchase && <NotFound string={'No se han encontrado compras'} />}

                    {loadingPurchase && <div className='d-flex justify-content-center' style={{ margin: '10px 0px', height: '20vh' }}><Loading /></div>}

                    {/* <div className='py-4 text-center'>
                      <div className='card-footer border-0 py-3 text-center'>
                        <a
                          onClick={() => handleChangePage(page - 1)}
                          className={page === 1
                            ? 'btn d-inline-flex btn-sm btn-neutral mx-1 disabled'
                            : 'btn d-inline-flex btn-sm btn-neutral mx-1 border-secondary'}
                        >
                          <span className='me-2'>
                            <i className='bi bi-chevron-double-left' />
                          </span>
                          <span>{strings('button.previous')}</span>
                        </a>
                        <a className='btn d-inline-flex btn-sm btn-neutral border-secondary mx-1'>
                          <span>{page}</span>
                        </a>
                        <a
                          onClick={() => handleChangePage(page + 1)}
                          className={page * limit >= count
                            ? 'btn d-inline-flex btn-sm btn-neutral mx-1 disabled'
                            : 'btn d-inline-flex btn-sm btn-neutral mx-1 border-secondary'}
                        >
                          <span className='me-2'>
                            <i className='bi bi-chevron-double-right' />
                          </span>
                          <span>{strings('button.next')}</span>
                        </a>
                      </div>
                      <p className='text-xs text-muted'>
                        {strings('placeholder.showResults', { actualResultsShowed: clients?.length, totalResults: count })}
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
