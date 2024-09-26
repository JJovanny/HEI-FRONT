import { ViewInvoiceModalAdmin } from 'components/admin/invoices/ViewInvoiceModal'
import { strings } from 'src/resources/locales/i18n'
import Loading from 'ui/Loading'
import { NotFound } from 'ui/NotFound'
import { TableInvoice } from './TableInvoice'

export const InvoiceList = ({ invoices, isLoading }) => {
  return (
    <div className='col-md-8 col-xl-9 h-100'>
      <div className='table-responsive'>
        <table className='table table-hover table-nowrap'>
          <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
            <tr>
              <th scope='col'>{strings('placeholder.invoiceNum')}</th>
              <th scope='col'>{strings('placeholder.date')}</th>
              <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.concept')}</th>
              <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.subtotal')}</th>
              <th scope='col'>{strings('placeholder.total')}</th>
              <th scope='col'><span className='d-none d-lg-block'>{strings('placeholder.state')}</span></th>
              <th />
            </tr>
          </thead>
          <tbody>
            {!isLoading && invoices?.map((invoice) => <TableInvoice invoice={invoice} key={invoice.id} />)}
          </tbody>
        </table>
        {isLoading && <div className='d-flex justify-content-center' style={{ margin: '10px 0px', height: '20vh' }}><Loading /></div>}
        {invoices?.length === 0 && !isLoading && <NotFound string={strings('alert.admin.invoices')} />}
      </div>
      <ViewInvoiceModalAdmin />
    </div>
  )
}
