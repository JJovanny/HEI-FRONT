import { useEffect } from 'react'
import { apiGetAdminInvoices, clearInvoicesData } from 'src/admin/invoices/AdminInvoicesActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import Loading from 'ui/Loading'
import { NotFound } from 'ui/NotFound'
import { InvoiceTable } from './invoiceTable'
import { ViewInvoiceModalAdmin } from './ViewInvoiceModal'

export const InvoicesContainer = () => {
  const dispatch = useDispatch()
  const { invoices, isLoadingGetInvoices } = useSelector(state => state.AdminInvoicesReducer)
  const { accessToken } = useSelector(state => state.AdminUserReducer)

  useEffect(() => {
    dispatch(clearInvoicesData())
    accessToken && dispatch(apiGetAdminInvoices())
    return () => {}
  }, [])

  return (
    <>
      <main className='pt-5 pb-8 bg-surface-secondary'>
        <div className='container-xl'>
          <div className='mt-n56 position-relative z-index-100'>
            <div className='card shadow overflow-hidden'>
              <div className='card-body p-0'>

                <div className='table-responsive'>
                  <table className='table table-hover table-nowrap'>
                    <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
                      <tr>
                        <th scope='col'>{strings('adminInvoices.invoiceNumber')}</th>
                        <th scope='col'>{strings('adminInvoices.date')}</th>
                        <th scope='col'>{strings('adminInvoices.company')}</th>
                        <th scope='col' className='d-none d-xl-table-cell'>{strings('adminInvoices.concept')}</th>
                        <th scope='col' className='d-none d-xl-table-cell'>{strings('adminInvoices.subtotal')}</th>
                        <th scope='col'>{strings('adminInvoices.total')}</th>
                        <th scope='col'><span className='d-none d-lg-block'>{strings('adminInvoices.status')}</span></th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.length > 0 && !isLoadingGetInvoices &&
                      invoices.map((invoice, index) => <InvoiceTable key={index} invoiceData={invoice} />)}
                    </tbody>
                  </table>
                  {isLoadingGetInvoices && <div className='d-flex justify-content-center' style={{ margin: '10px 0px', height: '20vh' }}><Loading /></div>}
                  {invoices?.length === 0 && !isLoadingGetInvoices && <NotFound string={strings('alert.admin.invoices')} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type='button'
          id='modal-open-view-invoice-admin'
          className='d-none'
          data-bs-target='#modalViewInvoiceAdmin'
          data-bs-toggle='modal'
        />
        <ViewInvoiceModalAdmin />
      </main>

    </>
  )
}
