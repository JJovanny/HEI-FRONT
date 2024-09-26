import { useState } from 'react'
import { apiGetAdminInvoice } from 'src/admin/invoices/AdminInvoicesActions'
import { formatShortDate, getInvoiceStatus, getInvoiceStatusBadgeColor, handleAdminDownloadPdf } from 'src/api/utils'
import InvoiceManager from 'src/invoice/InvoiceManager'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import { IInvoice } from 'src/types/invoice'


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

export const InvoiceTable = ({ invoiceData } : {invoiceData: {invoice:IInvoice, company:any}}) => {
  const dispatch = useDispatch()
  const [minTotal, setMinTotal] = useState(10000)
  const { invoice, company } = invoiceData
  const symbol = InvoiceManager.getCurrencySymbol(invoice.currency)

  const { accessToken } = useSelector(({ AdminUserReducer }) => {
    const { accessToken } = AdminUserReducer
    return { accessToken }
  })

  const handleSeeClick = async () => {
    await dispatch(apiGetAdminInvoice(invoice.id))
    document.getElementById('modal-open-view-invoice-admin')?.click()
  }

  return (
    <tr
      className={invoice.grandTotal >= minTotal ? 'table-active' : ''}
      style={{ cursor: 'pointer' }}
    >
      <td>
        <a className='text-heading font-semibold' type='button' onClick={handleSeeClick}>
          {invoice.invoiceNumber}
        </a>
      </td>
      <td>
        {formatShortDate(invoice.issueDate)}
      </td>
      <td>
        {company.name}
      </td>
      <td className='d-none d-xl-table-cell'>
        <div className='text-wrap'>
          {conceptLines(invoice.lines)}
        </div>
      </td>
      <td className='d-none d-xl-table-cell'>
        {strings('global.price', { price: invoice.subtotal?.toString()?.replace('.', ','), symbol })}
      </td>
      <td>
        {strings('global.price', { price: invoice.grandTotal.toString().replace('.', ','), symbol })}
      </td>
      <td>
        <span className='badge badge-lg badge-dot'>
          <i className={getInvoiceStatusBadgeColor(invoice.status) + ''} />
          <span className='d-none d-lg-table-cell'>{strings(`invoiceStatus.${getInvoiceStatus(invoice.status)}`)}</span>
        </span>
      </td>
      <td className='text-end'>
        {invoice.files.length > 0 && <span className='text-lg opacity-50'><i className='bi bi-paperclip' /></span>}
        <div className='dropdown'>
          <a className='ps-2 text-lg text-muted' href='#' role='button' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
            <i className='bi bi-three-dots-vertical' />
          </a>
          <div className='dropdown-menu'>
            <a role='button' onClick={handleSeeClick} className='dropdown-item'>
              <i className='bi bi-eye me-1' />
              {strings('adminInvoices.viewInvoice')}
            </a>
            {
            invoice.uploaded &&
              <a
                style={{ cursor: 'pointer' }} className='dropdown-item' onClick={async () => {
                  await handleAdminDownloadPdf(invoice.id, invoice.invoiceNumber, invoice.issueDate, accessToken)
                }}
              >
                <i className='bi bi-download me-1' />
                {strings('button.download')}
              </a>
            }
          </div>
        </div>
      </td>
    </tr>
  )
}
