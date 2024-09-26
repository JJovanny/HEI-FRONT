import { strings } from 'src/resources/locales/i18n'
import InvoiceManager from 'src/invoice/InvoiceManager'
import { formatShortDate, getInvoiceStatus, getInvoiceStatusBadgeColor, isInvoiceStatusQuickPay } from 'src/api/utils'
import { useDispatch } from 'src/redux/hooks'
import { IInvoice } from 'src/types/invoice'
import { apiGetClientInvoice } from 'src/client/ClientActions'
import { EUserType } from 'src/types/enums'
import { useSelector } from 'react-redux'
import { IUserState } from 'src/types/user'


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

export const ClientTableInvoice = ({ invoice } : {invoice: IInvoice}) => {
  const dispatch = useDispatch()
  const { id, invoiceNumber, issueDate, currency, files, subtotal, grandTotal, lines, status } = invoice
  const symbol = InvoiceManager.getCurrencySymbol(currency)
  const { accessToken, dataUser } = useSelector(({ UserReducer }) => {
    const { accessToken, dataUser } = UserReducer

    return { accessToken, dataUser }
  })

  const userType = dataUser?.userType

  const handleSeeClick = async () => {
    await dispatch(apiGetClientInvoice(invoice.id))
    document.getElementById('modal-open-view-invoice-customer')?.click()
  }

  return (
    <>
      <tr key={id}>
        <td>
          <a className='text-heading font-semibold' onClick={handleSeeClick} style={{ cursor: 'pointer' }}>
            {invoiceNumber || strings('placeholder.hasNotInvoiceNumber')}
          </a>
        </td>
        <td> {formatShortDate(issueDate)} </td>
        <td className='d-none d-xl-table-cell'>
          <div className='text-wrap'>
            {conceptLines(lines)}
          </div>
        </td>
        <td className='d-none d-xl-table-cell'>
          {strings('global.price', { price: subtotal?.toString()?.replace('.', ','), symbol })}
        </td>
        <td className='d-none d-xl-table-cell'>
          {strings('global.price', { price: grandTotal.toString().replace('.', ','), symbol })}
        </td>
        <td className='d-xl-table-cell'>
          {isInvoiceStatusQuickPay(status) && (
            <span className='badge badge-lg badge-dot'>
              <i className={getInvoiceStatusBadgeColor(status) + ''} />
              <span className='d-none d-lg-table-cell'>{userType !== EUserType.SUPPLIER ? strings('button.quickpayOffered') : strings('button.advanceAvailable')}</span>
            </span>
          )}
          {!isInvoiceStatusQuickPay(status) && (
            <span className='badge badge-lg badge-dot'>
              <i className={getInvoiceStatusBadgeColor(status) + ''} />
              <span className='d-none d-lg-table-cell'>{strings(`invoiceStatus.${getInvoiceStatus(status)}`)}</span>
            </span>
          )}
        </td>
        <td className='text-end'>
          {files?.length > 0 && <span className='text-lg opacity-50'><i className='bi bi-paperclip' /></span>}

          <div className='dropdown'>
            <a className='ps-2 text-lg text-muted' href='#' role='button' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
              <i className='bi bi-three-dots-vertical' />
            </a>
            <div className='dropdown-menu'>
              <a role='button' onClick={handleSeeClick} className='dropdown-item'>
                <i className='bi bi-eye me-1' />
                {strings('button.view')}
              </a>
            </div>
          </div>
          <button
            type='button'
            id='modal-open-view-invoice-customer'
            className='d-none'
            data-bs-target='#modalViewInvoiceCustomer'
            data-bs-toggle='modal'
          />
        </td>
      </tr>
    </>
  )
}
