/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { strings } from 'src/resources/locales/i18n'
import { useRouter } from 'next/navigation'
import { apiPatchDenyInvoice } from 'src/receivedInvoice/ReceivedInvoiceActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { IInvoice } from 'src/types/invoice'

export const DenyInvoiceModal = ({ route }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [denyInvoice, setDenyInvoice] = useState(false)
  const [comments, setComments] = useState('')

  const { id, invoiceNumber } = useSelector(({ InvoiceReducer }) => {
    const { invoice }: {invoice: IInvoice} = InvoiceReducer
    const { id, invoiceNumber } = invoice

    return { id, invoiceNumber }
  })

  useEffect(() => {
    id && denyInvoice && dispatch(apiPatchDenyInvoice(id, comments))
    return () => {}
  }, [denyInvoice, id])

  const handleDenyClick = () => {
    router.push(route)
  }

  return (
    <>
      <div className='modal fade' id='modalDeny' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex={-1} aria-labelledby='modal_example' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg'>
          <div className='modal-content shadow-3'>
            <div className='modal-header py-4'>
              <h5 className='modal-title'>{strings('invoiceActions.deny.title', { invoiceNumber })}</h5>
              <div className='text-xs ms-auto'>
                <button
                  type='button'
                  id='closeModalDeny'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label={strings('button.close')}
                />
              </div>
            </div>
            <div className='modal-body'>
              {/** Form */}
              <form id='form-deny'>
                <div className='form-group'>
                  <label className='form-label' htmlFor='comment'>{strings('invoiceActions.deny.commentsTitle')}</label>
                  <textarea className='form-control' rows={3} id='comment' onChange={(e) => setComments(e.target.value)} />
                  <div className='form-text'>{strings('invoiceActions.deny.commentsText')}</div>
                </div>
              </form>
            </div>
            <div className='modal-footer justify-content-between py-2'>
              <a role='button' className='btn btn-sm btn-neutral' data-bs-target='#modalViewItem' data-bs-toggle='modal' onClick={() => document.getElementById('closeModalDeny')?.click()}>
                <span className='pe-2'>
                  <i className='bi bi-arrow-return-left' />
                </span>
                {strings('button.back')}
              </a>
              <a
                role='button'
                className='btn btn-sm btn-primary'
                onClick={() => {
                  setDenyInvoice(true)
                  document.getElementById('closeModalDeny')?.click()
                }}
                data-bs-target='#modalDenyOK'
                data-bs-toggle='modal'
              >
                {strings('button.proceed')}
                <span className='ps-2'>
                  <i className='bi bi-arrow-right-circle-fill' />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/** MODAL DENY OK */}
      <div className='modal fade' id='modalDenyOK' tabIndex={-1} aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content shadow-4'>
            <div className='modal-body'>
              <div className='text-center py-5 px-5'>
                {/** Icon */}
                <div className='icon icon-shape icon-xl rounded-circle bg-soft-danger text-danger text-2xl'>
                  <i className='bi bi-x-circle-fill' />
                </div>
                {/** Title */}
                <h3 className='mt-7 mb-n4'>{strings('invoiceActions.deny.successfullyAction')}</h3>
              </div>
            </div>
            <div className='modal-footer justify-content-center pb-5 pt-0 border-top-0'>
              <a role='button' className='btn btn-sm btn-neutral' data-bs-dismiss='modal' onClick={handleDenyClick}>{strings('button.close')}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
