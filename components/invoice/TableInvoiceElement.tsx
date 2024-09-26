import { useRouter } from 'next/navigation'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import toast from 'react-hot-toast'
/** actions */
import {
  apiGetInvoice,
  clearInvoiceDataErrors,
  apiGetCurrencies,
  clearInvoiceData,
  setInvoiceDataProps,
  apiReadMessageInvoice,
  setIsMarkAsPaidProps,
  setPayToFinancialProps
} from 'src/invoice/InvoiceActions'
import InvoiceManager from 'src/invoice/InvoiceManager'
/** api */
import { formatShortDate, getInvoiceStatus, getInvoiceStatusBadgeColor, isInvoiceStatusQuickPay, handleDownloadPdf } from 'src/api/utils'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetTaxes } from 'src/tax/TaxActions'
import { apiGetSupplierClients } from 'src/client/ClientActions'
import { EUserType, InvoiceStatus, TypeCompany } from 'src/types/enums'
import { IUserState } from 'src/types/user'
import { isArrayAndNoEmpty } from 'src/validations/array'
import { useEffect, useState } from 'react'
import { Notification } from 'components/chat/Notification'
import { IInvoiceState } from 'src/types/invoice'
import { discountCalculation } from 'src/validations/numbers'
import { expirationDateWithCurrentDate } from 'src/utils/dates'
import moment from 'moment'
import { formatPrice } from 'src/utils/numbers'
import { postPin } from 'src/login/LoginActions'
import { apiGetUserMe } from 'src/user/UserActions'
import { formatCurrency } from 'src/utils/Utils'

export const TableInvoiceElement = ({ id, externalPayment, customer, supplierName, invoiceDatePaidOrAdvanced, totalTaxes, financial, statusQuickpay, dailyDiscountToApply, customerName, messages, invoiceNumber, issueDate, currency, uploaded, dueDate, files, subtotal, grandTotal, lines, status, earlyPaymentRequested, isSent = false, isDashboard = false, isReceived = false }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { invoiceIdToDelete } = useSelector((state) => state.InvoiceReducer as IInvoiceState)
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)
  const userType = dataUser?.userType
  const pinAccess = dataUser?.pinAccess
  const pinSuccess = dataUser?.pinSuccess
  const email = dataUser?.email
  const companyid = dataUser?.companyBranchSelected ? dataUser?.companyBranchSelected['id'] : ''
  const typeCompany = dataUser?.companyBranchSelected ? dataUser?.companyBranchSelected['typeCompany'] : ''
  const [isIdInvoice, setIsIdInvoice] = useState(false)
  const country = customer && customer?.country ? customer?.country?.code : ''
  const isExternal = externalPayment

  const { accessToken } = useSelector(({ UserReducer }) => {
    const { accessToken } = UserReducer

    return { accessToken }
  })

  const totalTaxesValidate: number = (totalTaxes ? totalTaxes : 0)
  const totalWhittTaxes: number = (grandTotal - totalTaxesValidate)
  const total: number = discountCalculation(totalWhittTaxes, dailyDiscountToApply, dueDate, country, invoiceDatePaidOrAdvanced)
  const totalToPay: number = totalWhittTaxes - total
  const advanceTotal = (totalToPay).toFixed(2)
  const calculate = (totalWhittTaxes - parseFloat(advanceTotal)).toFixed(2)

  const symbol = InvoiceManager.getCurrencySymbol(currency)
  const unreadMessages = isArrayAndNoEmpty(messages) ? messages.filter(message => !message.read && message?.recipients === companyid) : [];

  const unreadMessageCount = unreadMessages.length
  const unreadMessageIds = unreadMessages.map(message => message._id);
  const [hasUnread, setHasUnread] = useState(unreadMessageCount)

  const isFinancial = () => {
    return userType === EUserType.FINANCIAL
  }

  const notAccessPin = typeCompany === TypeCompany.CORPORATION && !pinAccess
  const accessPin = typeCompany === TypeCompany.CORPORATION && pinAccess && !pinSuccess


  const truncateString = (str, num) => {
    if (str && str.length > num) {
      return str.slice(0, num) + '...';
    }
    return str;
  };

  /* PRIVATE METHOD */
const conceptLines = (lines) => {
  if (lines.length === 0) return strings('placeholder.emptyConcept');
  let concept = '';
  for (let i = 0; i < lines.length && i < 3; i++) {
    let truncatedConcept = truncateString(lines[i].concept, 20);
    if (i <= lines.length - 1 && i === 2) concept += truncatedConcept + '...';
    else if (i === lines.length - 1) concept += truncatedConcept;
    else concept += truncatedConcept + ' + ';
  }
  return concept;
};

  const invoiceNumberShowed = () => {
    if (uploaded) {
      return <label className='text-heading font-semibold'>{invoiceNumber || strings('placeholder.hasNotInvoiceNumber')}</label>
    } else {
      return (
        <a className='text-heading font-semibold' onClick={handleEditClick} style={{ cursor: 'pointer' }}>
          {invoiceNumber || strings('placeholder.hasNotInvoiceNumber')}
        </a>
      )
    }
  }

  const handleSeeClick = async (isQuickpay = false) => {
    if ((financial !== undefined && (userType === EUserType.PAYER || userType === EUserType.BOTH))) {
      await handlePaymentToFinancial()
    } else {
      await dispatch(clearInvoiceData())
      await dispatch(apiGetInvoice(id, isQuickpay))
      // await dispatch(apiGetInvoice(id))
      await dispatch(setInvoiceDataProps({ prop: 'invoiceIdToDelete', value: id }))
      await dispatch(apiGetUserMe(false))
      document.getElementById('modal-open-view-item')?.click()
    }
  }

  const handleAdvancePayment = async () => {

    await dispatch(apiGetInvoice(id))
    await dispatch(setPayToFinancialProps({ prop: 'payToFinancial', value: false }))
    document.getElementById('modal-open-view-advance-payment')?.click()
  }

  const handleAdvanceInvoicePayer = async () => {
    if ((userType === EUserType.PAYER || userType === EUserType.BOTH) && isReceived) {
      await dispatch(setIsMarkAsPaidProps({ prop: 'isMarkPaid', value: false }))
      await dispatch(apiGetInvoice(id))
      document.getElementById('modal-open-view-advance-payment')?.click()
    }
  }

  const handlePaymentToFinancial = async () => {


    await dispatch(setPayToFinancialProps({ prop: 'payToFinancial', value: true }))
    await dispatch(apiGetInvoice(id))
    document.getElementById('modal-open-view-paymento-financial')?.click()
    // if (userType === EUserType.FINANCIAL) await dispatch(setIsMarkAsPaidProps({prop: 'isMarkPaid', value: true}))
  }

  const handleOpenChat = async () => {
    await dispatch(apiGetInvoice(id))
    document.getElementById('modal-open-chat')?.click()
    if (hasUnread !== 0) {
      await dispatch(apiReadMessageInvoice(id, unreadMessageIds))
      setHasUnread(0)
    }
  }

  const handleEditClick = async () => {
    await dispatch(clearInvoiceDataErrors())
    await dispatch(apiGetCurrencies())
    await dispatch(apiGetTaxes())
    await dispatch(apiGetSupplierClients())
    await dispatch(apiGetInvoice(id))
    router.push(`${Routing.invoices}/${id}`)
  }

  const handleRequestEarlyPayment = async () => {

    if ((userType === EUserType.SUPPLIER || userType === EUserType.BOTH) && !isReceived) {
      await dispatch(apiGetInvoice(id))
      document.getElementById('close-invoice-modal')?.click()
      document.getElementById('modal-info-early-payment')?.click()
    }
  }

  const hasRole = () => {
    return (userType === EUserType.FINANCIAL || userType === EUserType.SUPPLIER || userType === EUserType.PAYER || userType === EUserType.BOTH)
  }

  return (
    <>
      <tr key={id} style={{ cursor: 'pointer' }}>
        <td onClick={(e) => { handleSeeClick(false) }}>
          {invoiceNumberShowed()}
        </td>
        <td onClick={(e) => { handleSeeClick(false) }}> {formatShortDate(dueDate)} </td>
        {
          !isDashboard &&
          <td className='d-none d-xl-table-cell' onClick={(e) => { handleSeeClick(false) }}>
            <div className='text-wrap'>
              {supplierName || customerName || strings('placeholder.emptyClient')}
            </div>
          </td>
        }
        {isDashboard &&
          <>
            <td className='d-none d-xl-table-cell'>
              <div className='text-wrap'>
                {customerName || strings('placeholder.emptyClient')}
              </div>
            </td>
            <td className='d-none d-xl-table-cell'>
              <div className='text-wrap'>
                {supplierName || strings('placeholder.emptyClient')}
              </div>
            </td>
          </>}
        {isFinancial() && (
          <>
            <td className='d-none d-xl-table-cell' onClick={(e) => { handleSeeClick(false) }}> {customerName} </td>
          </>
        )}
        <td className='d-none d-xl-table-cell' onClick={(e) => { handleSeeClick(false) }}>
          <div className='text-wrap'>
            {conceptLines(lines)}
          </div>
        </td>
        {isFinancial() && (
          <>
            <td className='d-none d-xl-table-cell' onClick={(e) => { handleSeeClick(false) }}> {formatCurrency(country, parseFloat(subtotal))} </td>
            <td className='d-none d-xl-table-cell' onClick={(e) => { handleSeeClick(false) }}> {formatCurrency(country, parseFloat(advanceTotal))}</td>
          </>
        )}
        {!isFinancial() && (
          <>
            <td className='d-none d-xl-table-cell' onClick={(e) => { handleSeeClick(false) }}> {formatCurrency(country, parseFloat(subtotal))} </td>
            <td className='d-none d-xl-table-cell' onClick={(e) => { handleSeeClick(false) }}> {formatCurrency(country, parseFloat(grandTotal))} </td>
          </>
        )}
        {!isFinancial() && (
          <td className='text-center'>
            {(isInvoiceStatusQuickPay(status) && (userType === EUserType.SUPPLIER || userType === EUserType.BOTH)) && (
              <button
                type='button'
                className='btn btn-sm btn-success'
                onClick={handleRequestEarlyPayment}
              >
                {(userType === EUserType.SUPPLIER) && strings('button.advanceAvailable')}
                {(userType === EUserType.BOTH && isReceived) && strings('button.quickpayOffered')}
                {(userType === EUserType.BOTH && !isReceived) && strings('button.advanceAvailable')}
              </button>
            )}
            {(isInvoiceStatusQuickPay(status) && (userType !== EUserType.SUPPLIER && userType !== EUserType.BOTH)) && (
              <span className='badge badge-lg badge-dot' onClick={handleRequestEarlyPayment}>
                <i style={{ background: 'lightgreen' }} />
                {strings('button.quickpayOffered')}
              </span>
            )}
            {(!isInvoiceStatusQuickPay(status) && ((userType !== EUserType.PAYER && userType !== EUserType.BOTH) && status !== InvoiceStatus.ADVANCED)) && (
              <span className='badge badge-lg badge-dot'>
                {status === InvoiceStatus.REJECTED && (<p className='text-danger'>✘&nbsp;</p>)}
                {status !== InvoiceStatus.REJECTED && (<i className={getInvoiceStatusBadgeColor(status) + ''} />)}
                <span className='d-none d-lg-table-cell'>{strings(`invoiceStatus.${getInvoiceStatus(status)}`)}</span>
              </span>
            )}

            {(!isInvoiceStatusQuickPay(status) && ((status !== InvoiceStatus.APPROVAL_PENDING && status !== InvoiceStatus.ADVANCED && status !== InvoiceStatus.OVERDUE && status !== InvoiceStatus.QUICKPAY && userType === EUserType.PAYER || userType === EUserType.BOTH))) && (
              <span className='badge badge-lg badge-dot'>
                {status === InvoiceStatus.REJECTED && (<p className='text-danger'>✘&nbsp;</p>)}
                {status !== InvoiceStatus.REJECTED && (<i className={getInvoiceStatusBadgeColor(status) + ''} />)}
                <span className='d-none d-lg-table-cell'>{strings(`invoiceStatus.${getInvoiceStatus(status)}`)}</span>
              </span>
            )}

            {(!isInvoiceStatusQuickPay(status) && ((status === InvoiceStatus.QUICKPAY && isExternal && userType === EUserType.PAYER || userType === EUserType.BOTH))) && (
              <span className='badge badge-lg badge-dot'>
                <i className={getInvoiceStatusBadgeColor(status) + ''} />
                <span className='d-none d-lg-table-cell'>{strings(`invoiceStatus.${getInvoiceStatus(status)}`)}</span>
              </span>
            )}

            {(!isInvoiceStatusQuickPay(status) && ((status === InvoiceStatus.QUICKPAY && !isExternal && userType === EUserType.PAYER || userType === EUserType.BOTH))) && (
              <button
                type='button'
                className='btn btn-sm btn-primary'
                onClick={handleAdvanceInvoicePayer}
              >
                {strings(`invoiceStatus.advanceFinancial`)}
              </button>
            )}

            {(!isInvoiceStatusQuickPay(status) && (userType === EUserType.PAYER || userType === EUserType.BOTH) && (status === InvoiceStatus.APPROVAL_PENDING)) && (
              <button
                type='button'
                onClick={(e) => { handleSeeClick(false) }}
                className={`btn btn-sm text-white ${getInvoiceStatusBadgeColor(status)}`}
              >
                {strings(`invoiceStatus.${getInvoiceStatus(status)}`)}
              </button>
            )}
            {(status === InvoiceStatus.ADVANCED) && (
              <>
                {(financial === undefined) && (
                  <span className='badge badge-lg badge-dot' onClick={handleAdvancePayment}>
                    <p className='text-success me-2 h5'>✓</p>
                    <span className='d-none d-lg-table-cell'>{strings(`placeholder.advanced`)}</span>
                  </span>
                )}
                {(financial !== undefined && (userType !== EUserType.PAYER && userType !== EUserType.BOTH)) && (
                  <span className='badge badge-lg badge-dot' onClick={handleAdvancePayment}>
                    <p className='text-success me-2 h5'>✓</p>
                    <span className='d-none d-lg-table-cell'>{strings(`placeholder.advanced`)}</span>
                  </span>
                )}
              </>
            )}

            {((status === InvoiceStatus.ADVANCED || status === InvoiceStatus.OVERDUE) && (userType === EUserType.PAYER || userType === EUserType.BOTH)) && (
              <>
                {financial !== undefined && (
                  <button
                    type='button'
                    className='btn btn-sm text-white'
                    style={{ backgroundColor: '#c379f9' }}
                    onClick={handlePaymentToFinancial}
                  >
                    {strings('placeholder.payToFinancial')}
                  </button>
                )}
                {(financial === undefined && status === InvoiceStatus.OVERDUE) && (
                  <span className='badge badge-lg badge-dot'>
                    <i className={getInvoiceStatusBadgeColor(status) + ''} />
                    <span className='d-none d-lg-table-cell'>{strings(`invoiceStatus.${getInvoiceStatus(status)}`)}</span>
                  </span>
                )}
              </>
            )}
          </td>
        )}
        {isFinancial() && (
          <td className='text-center'>
            {statusQuickpay === undefined && (
              <button
                type='button'
                className='btn btn-sm btn-primary'
                onClick={handleAdvancePayment}
              >
                {strings(`invoiceStatus.advanceFinancial`)}
              </button>
            )}
            {statusQuickpay === InvoiceStatus.ADVANCED && (
              <span className='badge badge-lg badge-dot' onClick={handleAdvancePayment}>
                <p className='text-success me-2 h5'>✓</p>
                <span className='d-none d-lg-table-cell'>{strings(`placeholder.advanced`)}</span>
              </span>
            )}
            {statusQuickpay === InvoiceStatus.PAID && (
              <span className='badge badge-lg badge-dot'>
                <i className={getInvoiceStatusBadgeColor(statusQuickpay) + ''} />
                <span className='d-none d-lg-table-cell'>{strings(`invoiceStatus.${getInvoiceStatus(statusQuickpay)}`)}</span>
              </span>
            )}
          </td>
        )}
        <td>
          <a onClick={async () => { await handleDownloadPdf(id, invoiceNumber, issueDate, accessToken) }} className='btn btn-sm btn-primary align-items-center' style={{ cursor: 'pointer' }}>
            <i className='bi bi-download text-center h4 text-white' />
          </a>
        </td>
        <td className='text-start'>
          {hasRole() && (
            <div className='dropdown'>
              <a className='ps-2 text-lg text-muted' role='button'>
                <div style={{ position: 'absolute', top: -5, right: 0 }}>
                  <>
                    <i className={`bi bi-chat-fill me-1 h2 text-secondary`} onClick={(e) => { handleOpenChat() }}></i>
                    <Notification hasUnread={hasUnread} />
                  </>
                </div>
              </a>
            </div>
          )}
          <button
            type='button'
            id='modal-open-view-item'
            className='d-none'
            data-bs-target={isDashboard ? '#modalViewInvoiceDashboard' : '#modalViewItem'}
            data-bs-toggle='modal'
          />
          <button
            type='button'
            id='modal-info-early-payment'
            className='d-none'
            data-bs-target='#early-payment-data'
            data-bs-toggle='modal'
          />
          <button
            type='button'
            id='modal-success-early-payment'
            className='d-none'
            data-bs-target='#modalNewElementOK-early-payment'
            data-bs-toggle='modal'
          />
          <button
            type='button'
            id='modal-open-view-advance-payment'
            className='d-none'
            data-bs-target='#modalViewAdvancePayment'
            data-bs-toggle='modal'
          />
          <button
            type='button'
            id='modal-open-view-paymento-financial'
            className='d-none'
            data-bs-target='#modalViewPaymentToFinancial'
            data-bs-toggle='modal'
          />
          <button
            type='button'
            id='modal-open-chat'
            className='d-none'
            data-bs-target='#modalViewChat'
            data-bs-toggle='modal'
          />
        </td>
      </tr>

    </>
  )
}
