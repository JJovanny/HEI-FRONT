import { useRouter } from 'next/navigation'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
/** actions */
import {
  apiGetInvoice,
  clearInvoiceDataErrors,
  apiGetCurrencies,
  clearInvoiceData,
  setInvoiceDataProps,
  apiReadMessageInvoice
} from 'src/invoice/InvoiceActions'
import InvoiceManager from 'src/invoice/InvoiceManager'
/** api */
import { formatShortDate, getInvoiceStatus, getInvoiceStatusBadgeColor } from 'src/api/utils'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetTaxes } from 'src/tax/TaxActions'
import { apiGetSupplierClients } from 'src/client/ClientActions'
import { EUserType, InvoiceStatus, TypeCompany } from 'src/types/enums'
import { IUserState } from 'src/types/user'
import { discountCalculation } from 'src/validations/numbers'
import { Notification } from 'components/chat/Notification'
import { isArrayAndNoEmpty } from 'src/validations/array'
import { useEffect, useState } from 'react'
import { formatPrice } from 'src/utils/numbers'
import toast from 'react-hot-toast'
import { postPin } from 'src/login/LoginActions'
import Swal from 'sweetalert2'
import { apiGetUserMe } from 'src/user/UserActions'
import { formatCurrency } from 'src/utils/Utils'

export const TableInvoiceQuickpayElement = ({ id, externalPayment, customer, paymentDate, totalTaxPercentage, totalTaxes, invoiceDatePaidOrAdvanced, messages, dailyDiscountToApply, paymentPreferences, statusQuickpay, supplierName, customerName, invoiceNumber, issueDate, currency, uploaded, dueDate, files, subtotal, grandTotal, lines, status, earlyPaymentRequested, isSent = false, isDashboard = false, isReceived = false }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { dataUser } = useSelector(state => state.UserReducer as IUserState)
  const userType = dataUser?.userType
  const pinAccess = dataUser?.pinAccess
  const pinSuccess = dataUser?.pinSuccess
  const email = dataUser?.email
  const typeCompany = dataUser?.companyBranchSelected ? dataUser?.companyBranchSelected['typeCompany'] : ''
  const companyid = dataUser?.companyBranchSelected ? dataUser?.companyBranchSelected['id'] : ''
  const notAccessPin = typeCompany === TypeCompany.CORPORATION && !pinAccess
  const accessPin = typeCompany === TypeCompany.CORPORATION && pinAccess && !pinSuccess

  const { accessToken } = useSelector(({ UserReducer }) => {
    const { accessToken } = UserReducer

    return { accessToken }
  })

  const hasDiscount = paymentPreferences && paymentPreferences.dailyDiscountToApply !== undefined && paymentPreferences.dailyDiscountToApply !== 0
  const symbol = InvoiceManager.getCurrencySymbol(currency)
  const totalTaxesValidate: number = (totalTaxes ? totalTaxes : 0)
  const totalWhittTaxes: number = (grandTotal - totalTaxesValidate)
  const country = customer && customer?.country ? customer?.country?.code : ''

  const total: number = discountCalculation(totalWhittTaxes, dailyDiscountToApply, dueDate, country, invoiceDatePaidOrAdvanced)
  const totalToPay: number = totalWhittTaxes - total
  const advanceTotal = totalToPay 
	const calculate: number = isNaN(totalWhittTaxes) || isNaN(advanceTotal) ? 0 : (totalWhittTaxes - advanceTotal);
	const totalWhitDiscount = subtotal - calculate
  const taxes = (hasDiscount ? advanceTotal : subtotal) * ((totalTaxPercentage ? totalTaxPercentage : 0) / 100)
	const totalTaxesCalculate = advanceTotal + taxes

  const unreadMessages = isArrayAndNoEmpty(messages) ? messages.filter(message => !message.read && message?.recipients === companyid) : [];
  const unreadMessageCount =  unreadMessages.length
  const unreadMessageIds = unreadMessages.map(message => message._id)
  const [hasUnread, setHasUnread] = useState(unreadMessageCount)

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

  const chatWhenInvoiceIsExternal = userType === EUserType.SUPPLIER && externalPayment


  useEffect(() => {
    if (chatWhenInvoiceIsExternal) {
      setHasUnread(0)
    }
    else {
      setHasUnread(unreadMessageCount)
    }
  }, [messages, externalPayment])


  const handleSeeClick = async (isQuickpay = false) => {

    if ((userType === EUserType.PAYER || userType === EUserType.BOTH || userType === EUserType.SUPPLIER) && notAccessPin) {
      toast.error('No tienes habilitado el pin de acceso, habla con tu adminsitrador')
      return
    }

    await dispatch(apiGetUserMe())

    if (accessPin) {
      const { value: pin } = await Swal.fire({
        title: 'Ingrese el pin',
        input: 'password',
        inputPlaceholder: 'Contraseña',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Necesitas ingresar un pin';
          }
        }
      });

      if (pin) {
        const handleResponse = async (success, response) => {
          if (success) {
            await dispatch(clearInvoiceData())
            await dispatch(apiGetInvoice(id, isQuickpay))
            document.getElementById('modal-open-view-item')?.click() 
          } else {
            Swal.fire('Credenciales incorrectas.', '', 'error');
          }
        };

        try {
          await dispatch(postPin(pin, dataUser.id, handleResponse));
        } catch (error) {
        }

      }
      return;
    }

    await dispatch(clearInvoiceData())
    await dispatch(apiGetInvoice(id, isQuickpay))
    document.getElementById('modal-open-view-item')?.click() 
  }

  const handleEditClick = async () => {

    await dispatch(clearInvoiceDataErrors())
    await dispatch(apiGetCurrencies())
    await dispatch(apiGetTaxes())
    await dispatch(apiGetSupplierClients())
    await dispatch(apiGetInvoice(id))
    router.push(`${Routing.invoices}/${id}`)
  }

  const handleDropdownClick = async () => {
    await dispatch(setInvoiceDataProps({ prop: 'invoiceIdToDelete', value: id }))
  }

  const handleAdvancePayment = async () => {

    if ((userType === EUserType.SUPPLIER || userType === EUserType.BOTH)) {
      await dispatch(apiGetInvoice(id))
      document.getElementById('modal-open-view-advance-payment')?.click()
    }
  }
  const handleOpenChat = async () => {
    await dispatch(apiGetInvoice(id))
    document.getElementById('modal-open-chat')?.click()
    if (hasUnread !== 0) {
      await dispatch(apiReadMessageInvoice(id, unreadMessageIds))
      setHasUnread(0)
    }
  }

  return (
    <>
      <tr key={id} style={{ cursor: 'pointer' }}>
        <td onClick={(e) => { handleSeeClick(false) }}>
          {invoiceNumberShowed()}
        </td>
        <td className='d-none d-xl-table-cell'>
            <div className='text-wrap'>
              {supplierName || customerName || strings('placeholder.emptyClient')}
            </div>
        </td>
        <td className='text-center' onClick={(e) => { handleSeeClick(false) }}> {formatShortDate(dueDate)} </td>
        <td  onClick={(e) => { handleSeeClick(false) }} className='d-none d-xl-table-cell text-center'>{paymentDate ? formatShortDate(paymentDate) : '-'}</td>
        <td  onClick={(e) => { handleSeeClick(false) }} className='d-none d-xl-table-cell text-center'> {formatCurrency(country, parseFloat(totalWhittTaxes.toFixed(2)))}</td>
        <td  onClick={(e) => { handleSeeClick(false) }} className='d-none d-xl-table-cell text-center'>{formatCurrency(country, parseFloat(totalWhitDiscount.toFixed(2)))}</td>
        <td  onClick={(e) => { handleSeeClick(false) }} className='d-none d-xl-table-cell text-center'>{formatCurrency(country, parseFloat(totalTaxesCalculate.toFixed(2)))}</td>
        
        <td className='d-xl-table-cell'>
        {(statusQuickpay === InvoiceStatus.ADVANCED) && ( 
            <span className='badge badge-lg badge-dot' onClick={handleAdvancePayment}>
              <p className='text-success me-2 h5'>✓</p>
              <span className='d-none d-lg-table-cell'>{strings(`placeholder.advanced`)}</span>
            </span>
          )}
          {((statusQuickpay === undefined || statusQuickpay !== undefined) && (statusQuickpay !== InvoiceStatus.ADVANCED)) && ( 
          <span className='badge badge-lg badge-dot'>
            <i className={getInvoiceStatusBadgeColor(statusQuickpay) + ''} />
            <span className='d-none d-lg-table-cell'>{strings(`invoiceStatus.${getInvoiceStatus(statusQuickpay === undefined ? InvoiceStatus.IN_PROGRESS : statusQuickpay)}`)}</span> 
          </span>
          )}
        </td>
        <td className='text-center'>
        <div className='dropdown'>
          <a className='ps-2 text-lg text-muted' role='button'>
            <div style={{ position: 'absolute', top: -5, right:0}}>
              <>
                <i className={`bi bi-chat-fill me-1 h2 text-secondary`} onClick={(e) => { handleOpenChat() }}></i> 
                <Notification hasUnread={hasUnread}/>
              </>
            </div>
          </a>
        </div>
          <button
            type='button'
            id='modal-open-view-advance-payment'
            className='d-none'
            data-bs-target='#modalViewAdvancePayment'
            data-bs-toggle='modal'
          />
          <button
            type='button'
            id='modal-open-view-item'
            className='d-none'
            data-bs-target='#modalViewItem'
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
