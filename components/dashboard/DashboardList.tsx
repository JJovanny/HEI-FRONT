import React, { useEffect } from 'react'
import Link from 'next/link'
import { strings } from '../../src/resources/locales/i18n'
import { apiGetDashboard, clearDataDashboard } from '../../src/dashboard/DashboardActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import Routing from '../../src/routing'
import InvoiceManager from '../../src/dashboard/DashboardManager'
import Loading from 'ui/Loading'
import {
  apiGetInvoicesIssued,
  clearInvoiceToInitialState,
  setInvoiceDataProps
  , apiDeleteInvoice,
  apiGetMyCompanyInvoices
} from '../../src/invoice/InvoiceActions'
import { TableInvoiceElement } from '../invoice/TableInvoiceElement'
import { ViewInvoiceModal } from 'components/modal/ViewInvoiceModal'
import { NotFound } from 'ui/NotFound'
import { AddSuccessModal } from 'components/modal/AddSuccessModal'
import { IInvoiceState } from 'src/types/invoice'
import { DeleteModal } from '../modal/DeleteModal'
import { ViewInvoiceModalDashboard } from 'components/modal/ViewInvoiceModalDashboard'
import { apiGetUserMe } from 'src/user/UserActions'

export const DashboardList = () => {
  const dispatch = useDispatch()

  const { dataDashboard, isLoadingGetDashboard, invoices, isLoadingGetInvoices, invoiceIdToDelete, dataUser } = useSelector(({ DashboardReducer, InvoiceReducer, UserReducer }) => {
    const { dataDashboard, isLoadingGetDashboard } = DashboardReducer
    const { invoices, isLoadingGetInvoices, invoiceIdToDelete } = InvoiceReducer as IInvoiceState
    const { dataUser } = UserReducer

    return { dataDashboard, dataUser, isLoadingGetDashboard, invoices, isLoadingGetInvoices, invoiceIdToDelete }
  })

  useEffect(() => {
    dispatch(clearDataDashboard())
    dispatch(apiGetUserMe())
    dispatch(apiGetDashboard())
  }, [])

  const usersInvite = dataDashboard && dataDashboard.users ? dataDashboard.users : 0;
  const usersThisMonth = dataDashboard && dataDashboard.usersThisMonth ? dataDashboard.usersThisMonth : 0;
  const totalScore = dataDashboard && dataDashboard.totalScore ? dataDashboard.totalScore : 0;
  
  const thisMonth = InvoiceManager.getThisMonth(dataDashboard)
  const issued = InvoiceManager.getIssued(thisMonth)
  const thisMonthIssued = InvoiceManager.getThisMonth(issued)
  const quantity = InvoiceManager.getQuantity(thisMonthIssued)
  const invoicesPercentage = InvoiceManager.getInvoicesPercentage(thisMonthIssued)
  const clients = InvoiceManager.getClients(thisMonthIssued)
  const clientsPercentage = InvoiceManager.getClientsPercentage(thisMonthIssued)
  const paymentStatusPercentage = InvoiceManager.getPaymentStatusPercentage(thisMonthIssued)

  if (isLoadingGetDashboard || isLoadingGetInvoices) {
    return <div className='mt-5'><Loading /></div>
  }

  return (
    <main id='dashboard' className='py-5 py-lg-8 bg-surface-secondary'>
      <div className='container-xl'>
        <div className='mt-n56 position-relative z-index-100'>
          <div className='card rounded shadow overflow-hidden'>
            <div className='card-body p-4 p-lg-5 p-xl-6'>
              
              <div className='row g-6 mb-6'>
                <div className='col-xl-3 col-sm-6 col-12'>
                  <div className='card h-100'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <span className='h6 font-semibold text-muted text-sm d-block mb-2'>Total puntos acumulado</span>
                          <span className='h1 font-bold mb-0'>{totalScore} pts</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-tertiary text-white text-lg rounded-circle'>
                            <i className='bi bi-receipt' />
                          </div>
                        </div>
                      </div>
                      {/* <div className='mt-2 mb-0 text-sm'>
                        <span className='badge badge-pill bg-opacity-30 bg-success text-white me-2'>
                          <i className='bi bi-arrow-up me-1' />{totalScore} pts
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-sm-6 col-12'>
                  <div className='card h-100'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <span className='h6 font-semibold text-muted text-sm d-block mb-2'>Usuarios invitados</span>
                          <span className='h1 font-bold mb-0'>{usersInvite}</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-primary text-white text-lg rounded-circle'>
                            <i className='bi bi-people' />
                          </div>
                        </div>
                      </div>
                      <div className='mt-2 mb-0 text-sm'>
                        <span className='badge badge-pill bg-opacity-30 bg-success text-white me-2'>
                          <i className='bi bi-arrow-up me-1' />{usersThisMonth} %
                        </span>
                        <span className='text-nowrap text-xs text-muted'>{strings('dashboard.sinceLastMonth')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className='col-xl-3 col-sm-6 col-12'>
                  <div className='card h-100'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <span className='h6 font-semibold text-muted text-sm d-block mb-2'>{strings('dashboard.creditProviders')}</span>
                          <span className='h1 font-bold mb-0'>{financialCompanies}</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-info text-white text-lg rounded-circle'>
                            <i className='bi bi-bank' />
                          </div>
                        </div>
                      </div>
                      <div className='mt-2 mb-0 text-sm'>
                        <Link href={Routing.payers} className='btn btn-xs btn-neutral m-0'>{strings('dashboard.viewAll')}</Link>
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* <div className='col-xl-3 col-sm-6 col-12'>
                  <div className='card h-100'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col'>
                          <span className='h6 font-semibold text-muted text-sm d-block mb-2'>Gastos</span>
                          <span className='h1 font-bold mb-0'>{paymentStatusPercentage}%</span>
                        </div>
                        <div className='col-auto'>
                          <div className='icon icon-shape bg-success text-white text-lg rounded-circle'>
                            <i className='bi bi-cash' />
                          </div>
                        </div>
                      </div>
                      <div className='mt-5 mb-1 progress progress-sm shadow-none'>
                        <div
                          className='progress-bar bg-primary'
                          role='progressbar'
                          style={{ width: paymentStatusPercentage + '%' }}
                          aria-valuenow={73}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
