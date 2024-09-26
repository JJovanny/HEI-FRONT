import { strings } from 'src/resources/locales/i18n'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'

export const AddInvoiceModalDraft = () => {
  const router = useRouter()

  const handleClose = () => {
    router.push(Routing.invoices)
  }

  return (
    <>
      <div className='modal fade' id='modalok_draft' tabIndex={-1} aria-labelledby='modalok_new' aria-hidden='true'>
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
              </div>
            </div>
            <div className='modal-footer bg-card-hover justify-content-center align-items-center'>
              <a role='button' className='btn btn-sm btn-neutral d-none d-lg-inline-flex' data-bs-dismiss='modal' onClick={handleClose}>{strings('button.close')}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
