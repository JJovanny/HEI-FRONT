import Loading from 'ui/Loading'
import React, { useEffect } from 'react'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetInvoicesIssued, setInvoiceDataProps, apiDeleteInvoice, apiPostRequestEarlyPayment, clearInvoicesFilters, setValueInvoicesFiltersData } from 'src/invoice/InvoiceActions'
import { ViewInvoiceModal } from 'components/modal/ViewInvoiceModal'
import { IInvoiceState } from 'src/types/invoice'
import { AddSuccessModal } from 'components/modal/AddSuccessModal'
import { NotFound } from 'ui/NotFound'
import { DeleteModal } from '../modal/DeleteModal'
import Routing from '../../src/routing'
import { PaymentDataModal } from 'components/modal/PaymentDataModal'
import { TableInvoiceQuickpayElement } from './TableInvoiceQuickpayElement'
import { ViewInvoiceModalAdvancePayment } from 'components/modal/ViewInvoiceModalAdvancePayment'
import { ChatModal } from 'components/modal/ChatModal'
import { SupplierOrBothChecker } from 'src/validations/roles'
import { StatusQuickpaySupplierOrBoth } from 'src/utils/text'
import Tooltip from 'components/ToolTip'
import { apiGetAdminUser } from 'src/admin/user/AdminUserActions'
import { apiGetUserMe } from 'src/user/UserActions'
import { EventRegistration } from 'components/modal/EventRegistration'

export const TableInvoiceQuickpay = () => {
  const dispatch = useDispatch()
  const { invoices, isLoadingGetInvoices, page, count, limit, invoiceIdToDelete } = useSelector((state) => state.InvoiceReducer as IInvoiceState)

  const handleChangePage = (newPage) => {
    dispatch(setInvoiceDataProps({ prop: 'page', value: newPage }))
  }

  
  // useEffect(() => {
  //   dispatch(clearInvoicesFilters())
  //   dispatch(setValueInvoicesFiltersData({ prop: 'clear', value: true }))
  // },[])

  return (
    <>
      {isLoadingGetInvoices
        ? <div className='m-5'><Loading /></div>
        : (// eslint-disable-next-line react/jsx-closing-tag-location
          <div className='table-responsive'>
            <table className='table table-hover table-nowrap'>
              <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
                <tr>
                  <th scope='col'>{strings('placeholder.invoiceNumber').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.customer').toUpperCase()}</th>
                  <th scope='col'>{strings('form.placeholder.dueDate').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.paymentDate').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.invoicetotal').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.totalAfterDiscount').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('modals.paymentData.totalWithTaxes').toUpperCase()}</th>
                  <th scope='col' className='d-xl-table-cell'>
                    <div className='justify-content-center d-flex'>
                      <span className='d-lg-block me-2 mt-1'>{strings('placeholder.state').toUpperCase()}</span>
                      <SupplierOrBothChecker>
                        <Tooltip text={StatusQuickpaySupplierOrBoth}/>
                      </SupplierOrBothChecker>
                    </div>  
                  </th>
                  <th scope='col' />
                </tr>
              </thead>
              <tbody> 
                {invoices.map((invoice) =>
                  <TableInvoiceQuickpayElement
                    customer={invoice?.customer}
                    externalPayment={invoice?.paymentPreferences?.externalPayment}
                    totalTaxPercentage={invoice?.totalTaxPercentage}
                    key={invoice.id}
                    id={invoice.id}
                    invoiceDatePaidOrAdvanced={invoice?.invoiceDatePaidOrAdvanced}
                    totalTaxes={invoice?.totalTaxes}
                    messages={invoice?.messages}
                    dailyDiscountToApply={invoice?.paymentPreferences ? invoice?.paymentPreferences.dailyDiscountToApply : 0}
                    paymentDate={invoice?.paymentDate}
                    supplierName=''
                    statusQuickpay={invoice?.statusQuickpay}
                    paymentPreferences={invoice?.paymentPreferences}
                    customerName={invoice?.customer?.name}
                    invoiceNumber={invoice.invoiceNumber}
                    issueDate={invoice.issueDate}
                    currency={invoice.currency}
                    uploaded={invoice.uploaded}
                    dueDate={invoice.dueDate}
                    files={invoice.files}
                    subtotal={invoice.subtotal}
                    grandTotal={invoice.grandTotal}
                    lines={invoice.lines}
                    status={invoice.status}
                    earlyPaymentRequested={invoice.earlyPaymentRequested}
                    isSent
                  />)}
              </tbody>
            </table>
            <DeleteModal
              id={invoiceIdToDelete}
              apiDelete={apiDeleteInvoice}
              route={Routing.invoices}
              callback={apiGetInvoicesIssued}
              question={strings('placeholder.deleteElementQuestion', { element: strings('placeholder.invoice').toLowerCase() })}
              warning={strings('placeholder.deleteElementWarning', { element: strings('placeholder.invoice').toLowerCase() })}
              success={strings('placeholder.deleteElementSuccess', { element: strings('placeholder.invoice') })}
            />
            {!(invoices.length > 0)
              ? <NotFound string={strings('alert.issuedInvoices')} />
              : <></>}

            {/** If I'm the supplier, the customer is not required */}
            <ViewInvoiceModal iAmTheSupplier /> 
            <ViewInvoiceModalAdvancePayment iAmTheSupplier={false} isInvoicesQuickPay={true} />
            <EventRegistration />
            <ChatModal/>
            <AddSuccessModal
              id='early-payment'
              redirect={false}
              route=''
              callback={false}
              icon='bi bi-credit-card-2-front'
              successText='requestEarlyPaymentSuccess'
            />
            <PaymentDataModal />

            <div className='py-4 text-center'>
              <div className='card-footer border-0 py-3 text-center'>
                {/** Previous */}
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
                {/** Actual page */}
                <a className='btn d-inline-flex btn-sm btn-neutral border-secondary mx-1'>
                  <span>{page}</span>
                </a>
                {/** Next */}
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
                {strings('placeholder.showResults', { actualResultsShowed: invoices.length, totalResults: count })}
              </p>
            </div>
          </div>
          )}
      <AddSuccessModal
        redirect={false}
        route={null}
        callback={apiGetInvoicesIssued}
        icon='bi bi-check-circle-fill'
        successText='markAsPaidSuccess'
      />
    </>
  )
}
