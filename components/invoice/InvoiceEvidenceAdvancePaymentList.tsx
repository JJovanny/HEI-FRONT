import { postDownloadInvoiceAttachment, postDownloadInvoiceAttachmentAdmin } from 'src/api/utils'
import { setValuePostInvoiceData, validatePostInvoice } from 'src/invoice/InvoiceActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { IFiles, IInvoice } from 'src/types/invoice'

export const InvoiceEvidenceAdvancePaymentList = ({ index, onlyView, fileName, size, format, path, isAdmin = false }) => {
  const dispatch = useDispatch()
  const { accessToken, invoice, adminAccessToken } = useSelector(({ UserReducer, InvoiceReducer, AdminUserReducer }) => {
    const { invoice }: {invoice: IInvoice} = InvoiceReducer
    const { accessToken } = UserReducer
    const { accessToken: adminAccessToken } = AdminUserReducer

    return { accessToken, invoice, adminAccessToken }
  })

  const { evidenceAdvancePayment }: { evidenceAdvancePayment: IFiles[] } = invoice

  const handleDownloadFile = async () => {
    const response = !isAdmin
      ? await postDownloadInvoiceAttachment(path, invoice?.id, accessToken)
      : await postDownloadInvoiceAttachmentAdmin(path, adminAccessToken)
    const href = URL.createObjectURL(response.data)
    const name = fileName.split('.')[0]

    const link = document.createElement('a')
    link.href = href
    link.setAttribute('download', `${name}.${format}`)
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(href)
  }

  const fileSize = Math.round(size / 1000) + ' KB'

  const _setValuePostInvoiceData = (prop, value) => {
    dispatch(setValuePostInvoiceData({ prop, value }))
  }

  return (
    <div className={onlyView ? 'col-xl-6 col-md-6' : 'col-xl-4 col-md-6'} key={fileName}>
      <div className='position-relative border rounded bg-white'>
        <div className='p-3 d-flex align-items-center'>
          <div className='me-4'>
            <div className={/^(pdf)$/g.test(format) // PDF
              ? 'icon icon-shape text-xl bg-red-500 text-white'
              : /^(xmls{0,1})$/g.test(format) || /^(xls[xmb]{0,1})$/g.test(format) // XML
                ? 'icon icon-shape text-xl bg-green-500 text-white'
                : /^(docx{0,1})$/g.test(format) // DOC
                  ? 'icon icon-shape text-xl bg-blue-500 text-white'
                  : /^(png)$/g.test(format) || /^(jpe{0,1}g)$/g.test(format) // Image
                    ? 'icon icon-shape text-xl bg-yellow-500 text-white'
                    : 'icon icon-shape text-xl bg-white-500 text-black'}
            >
              <i className={format === 'pdf'
                ? 'i bi-file-earmark-pdf'
                : format === 'xml' || format === 'xmls'
                  ? 'bi bi-file-earmark-excel'
                  : format === 'doc' || format === 'docx'
                    ? 'bi bi-file-earmark-font'
                    : format === 'png' || format === 'jpg' || format === 'jpeg'
                      ? 'bi bi-file-earmark-image'
                      : 'bi bi-file-earmark'}
              />
            </div>
          </div>
          <div className='flex-fill'>
            <a className='d-block h6 text-sm font-semibold mb-1'>{fileName}</a>
            {size && size !== 0
              ? <span className='d-block text-xs'>{fileSize}</span>
              : <></>}
          </div>
          <div className={onlyView ? 'ms-4 pe-2 text-end' : 'd-none'}>
            <a
              className='text-muted h4 p-1'
              role='button'
              data-bs-toggle='tooltip'
              data-bs-title='Download'
              onClick={handleDownloadFile}
            >
              <i className='bi bi-download' />
            </a>
          </div>
          {onlyView
            ? <></>
            : (
              <>
                <div className='ms-4 pe-2 text-end'>
                  <a
                    className='text-muted h4 p-1 text-danger'
                    role='button'
                    data-bs-toggle='tooltip'
                    data-bs-title='DeleteFile'
                    onClick={async (e) => {
                        evidenceAdvancePayment[index].remove = true
                      await _setValuePostInvoiceData('evidenceAdvancePayment', evidenceAdvancePayment)
                      await dispatch(validatePostInvoice())
                    }}
                  >
                    <i className='bi bi-trash me-1' />
                  </a>
                </div>
              </>)}
        </div>
      </div>
    </div>
  )
}
