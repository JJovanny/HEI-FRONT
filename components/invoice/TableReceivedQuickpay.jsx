import Loading from 'ui/Loading'
import React from 'react'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { setReceivedInvoiceDataProps } from 'src/receivedInvoice/ReceivedInvoiceActions'
import { ViewInvoiceModal } from 'components/modal/ViewInvoiceModal'
import { NotFound } from 'ui/NotFound'
import { DenyInvoiceModal } from 'components/modal/invoiceActions/DenyInvoiceModal'
import { AcceptInvoiceModal } from 'components/modal/invoiceActions/AcceptInvoiceModal'
import Routing from 'src/routing'
import { TableInvoiceReceivedQuickPayElement } from './TableInvoiceReceivedQuickPayElement'
import { ChatModal } from 'components/modal/ChatModal'
import { ViewInvoiceModalAdvancePayment } from 'components/modal/ViewInvoiceModalAdvancePayment'
import { EUserType } from 'src/types/enums'
import { IsFinancialChecker, PayeerOrBothChecker } from 'src/validations/roles'
import { StatusFinancial, StatusPayerOrBoth, StatusQuickpayFinancial, StatusQuickpayPayerOrBoth } from 'src/utils/text'
import Tooltip from 'components/ToolTip'
import { ViewInvoiceModalPaymentToFinancial } from 'components/modal/ViewInvoiceModalPaymentToFinancial'
import { clearInvoicesFilters, setValueInvoicesFiltersData } from 'src/invoice/InvoiceActions'
import { EventRegistration } from 'components/modal/EventRegistration'

export const TableReceivedQuickpay = () => {
  const dispatch = useDispatch()
  const { receivedInvoices, isLoadingReceivedInvoices, page, count, limit } = useSelector(({ ReceivedInvoiceReducer }) => {
    const { receivedInvoices, isLoadingReceivedInvoices, page, count, limit } = ReceivedInvoiceReducer

    return { receivedInvoices, isLoadingReceivedInvoices, page, count, limit }
  })
  if (isLoadingReceivedInvoices) return <div className='m-5'><Loading /></div>

  const {dataUser } = useSelector(({ UserReducer }) => {
    const { dataUser } = UserReducer
    return {dataUser }
  })
  const { userType } = dataUser

  const handleChangePage = (newPage) => {
    dispatch(setReceivedInvoiceDataProps({ prop: 'page', value: newPage }))
  }

  // useEffect(() => {
  //   dispatch(clearInvoicesFilters())
  //   dispatch(setValueInvoicesFiltersData({ prop: 'clear', value: true }))
  // },[])

  return (
    <>
      {isLoadingReceivedInvoices 
        ? <div className='m-5'><Loading /></div>
        : (// eslint-disable-next-line react/jsx-closing-tag-location
          <div className='table-responsive'>
            <table className='table table-hover table-nowrap'>
              <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
                <tr>
                  <th scope='col'>{strings('placeholder.invoiceNumber').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.supplier').toUpperCase()}</th>
                  <th scope='col'>{strings('form.placeholder.dueDate').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.payday').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.invoicetotal').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.totalAfterDiscount').toUpperCase()}</th>
                  {userType === EUserType.FINANCIAL && (
                    <>
                    <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.dailyInterest').toUpperCase()}</th>
                    </>
                  )}
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('modals.paymentData.totalWithTaxes').toUpperCase()}</th>
                  <th scope='col' className='d-none d-xl-table-cell'>{strings('placeholder.financing').toUpperCase()}</th>
                  <th scope='col' className='d-xl-table-cell'>
                    <div className='justify-content-center d-flex'>
                      <span className='d-lg-block me-2 mt-1'>{strings('placeholder.state').toUpperCase()}</span>
                      <PayeerOrBothChecker>
                        <Tooltip text={StatusQuickpayPayerOrBoth}/>
                      </PayeerOrBothChecker>
                      <IsFinancialChecker>
                        <Tooltip text={StatusQuickpayFinancial}/>
                      </IsFinancialChecker>
                    </div>
                  </th>
                  <th scope='col' />
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line array-callback-return */}
                {receivedInvoices.map((invoice) =>
                  <TableInvoiceReceivedQuickPayElement
                    customer={invoice?.customer}
                    invoiceDatePaidOrAdvanced={invoice?.invoiceDatePaidOrAdvanced}
                    financial={invoice?.financial}
                    totalTaxes={invoice?.totalTaxes}
                    isReceived
                    messages={invoice?.messages}
                    key={invoice.id}
                    id={invoice.id}
                    paymentDate={invoice?.paymentDate}
                    dueDate={invoice?.dueDate}
                    supplierName={invoice?.supplier?.name}
                    customerName=''
                    dailyDiscountToApply={invoice?.dailyDiscountToApply}
                    invoiceNumber={invoice.invoiceNumber}
                    issueDate={invoice.issueDate}
                    currency={invoice.currency}
                    uploaded={invoice.uploaded}
                    files={invoice.files}
                    subtotal={invoice.subtotal}
                    grandTotal={invoice.grandTotal}
                    lines={invoice.lines}
                    status={invoice.status}
                    statusQuickpay={invoice?.statusQuickpay}
                    paymentPreferences={invoice.paymentPreferences}
                    earlyPaymentRequested={invoice?.earlyPaymentRequested}
                  />)}
              </tbody>
            </table>

            {!(receivedInvoices.length > 0)
              ? <NotFound string={strings('alert.receivedInvoices')} />
              : <></>}

            {/** If I'm the customer, the supplier is required (not empty). */}
            <ViewInvoiceModal iAmTheSupplier={false} />
            <ChatModal isReceived/>
            <ViewInvoiceModalAdvancePayment iAmTheSupplier={false} isInvoicesQuickPay={true}/>
            <ViewInvoiceModalPaymentToFinancial iAmTheSupplier={false}/>
            <EventRegistration />
            
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
                {strings('placeholder.showResults', { actualResultsShowed: receivedInvoices.length, totalResults: count })}
              </p>
            </div>
          </div>)}
      <DenyInvoiceModal
        route={Routing.invoices}
      />
      <AcceptInvoiceModal
        route={Routing.invoices}
      />
    </>
  )
}
