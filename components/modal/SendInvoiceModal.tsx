import { strings } from 'src/resources/locales/i18n'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
import { useSelector } from 'src/redux/hooks'
import { SendEmailModal } from './SendEmailModal'
import { handleDownloadPdf } from 'src/api/utils'

export const SendInvoiceModal = () => {
  const router = useRouter()
  const { accessToken, invoice } = useSelector(({ UserReducer, InvoiceReducer }) => {
    const { accessToken } = UserReducer
    const { invoice } = InvoiceReducer

    return { accessToken, invoice }
  })

  const { id, invoiceNumber, issueDate } = invoice

  const handleClose = () => {
    router.push(Routing.invoices)
  }

  return (
    <>
      <div className='modal fade' id='modalok_new' tabIndex={-1} aria-labelledby='modalok_new' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content shadow-4'>
            <div className='modal-body py-5 px-0'>
              <div className='text-center'>
                {/** Icon */}
                <div className='icon icon-shape rounded-circle bg-soft-primary text-primary text-xl my-5'>
                  <i className='bi bi-check-circle-fill' />
                </div>
                {/** Title */}
                <h3 className='px-5 mb-4'>{strings('modals.sendInvoice.uploadInvoiceSuccesfully')}</h3>
                {/** Text */}
                <p className='text-sm text-muted px-5'>
                  {strings('modals.sendInvoice.uploadInvoiceSuccesfullyText')}
                </p>
              </div>
            </div>
            <div className='modal-footer bg-card-hover justify-content-center justify-content-lg-between align-items-center'>
              <a role='button' className='btn btn-sm btn-neutral d-none d-lg-inline-flex' data-bs-dismiss='modal' onClick={handleClose}>{strings('button.close')}</a>
              <a role='button' className='d-none' id='closeInvoiceOptionsModal' data-bs-dismiss='modal' />
              {/** Opciones */}
              <div className='d-flex justify-content-center gap-3'>
                <a
                  role='button' className='btn btn-sm btn-primary' onClick={async () => {
                    await handleDownloadPdf(id, invoiceNumber, issueDate, accessToken)
                    document.getElementById('closeInvoiceOptionsModal')?.click()
                    handleClose()
                  }}
                >{strings('button.downloadPDF')}
                </a>
                <a
                  role='button'
                  className='btn btn-sm btn-primary'
                  data-bs-toggle='modal'
                  data-bs-target='#modalSend'
                  onClick={() => document.getElementById('closeInvoiceOptionsModal')?.click()}
                >
                  {strings('button.sendEmail')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SendEmailModal handleClose={handleClose} />
    </>
  )
}
