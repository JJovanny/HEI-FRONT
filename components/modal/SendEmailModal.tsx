import React from 'react'
/** actions */
import {
  setInvoiceDataProps,
  apiPostSendInvoiceByEmail,
  validatePostSendInvoiceByEmail
} from 'src/invoice/InvoiceActions'
/** components */
import TextInput from 'ui/input/TextInput'
/** resources */
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { IError } from 'src/types/global'
import { isFocusHere } from 'src/api/utils'

type Props = {
  handleClose?: (e?:any) => any
}
export const SendEmailModal = (props: Props) => {
  const dispatch = useDispatch()
  const { handleClose } = props
  const { emails, isLoadingPostDataEmails, errorEmailsData, submitPost } = useSelector(({ InvoiceReducer }) => {
    const { emails, isLoadingPostDataEmails, errorEmailsData, submitPost } = InvoiceReducer

    return { emails, isLoadingPostDataEmails, errorEmailsData, submitPost }
  })

  /** Private methods */
  const handleSendByEmail = async () => {
    dispatch(setInvoiceDataProps({ prop: 'submitPost', value: true }))
    const errors = await validatePostSendInvoiceByEmail(dispatch, emails)
    if (errors?.length === 0) await dispatch(apiPostSendInvoiceByEmail())
    else await getFirstInputErrorId(errors)?.focus()
  }

  const getFirstInputErrorId = (errors: IError[]) => {
    if (errors.find(error => isFocusHere(error, 'emails'))) return document.getElementById('emails')
    return null
  }

  const handleClickClose = () => {
    document.getElementById('sendEmailModalClose')?.click()
  }

  return (
    <>
      <div className='modal fade' id='modalSend' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex={-1} aria-labelledby='modal_example' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered'>
          <div className='modal-content shadow-3'>
            <div className='modal-header py-4'>
              <h5 className='modal-title'>{strings('modals.sendEmail.sendInvoice')}</h5>
              <div className='text-xs ms-auto'>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' onClick={handleClose} />
              </div>
            </div>
            <div className='modal-body'>
              {/** Form Enviar Email */}
              <form id='form-send'>
                <div className='form-group'>
                <div className='d-flex flex-column flex-sm-row justify-content-start mb-2'>
                  <h6 className='me-1 mb-1 mb-sm-0'>{strings('form.placeholder.recipients')}:</h6>
                  <strong><p className='mb-0' style={{fontSize: '12px'}}>({strings('modals.sendEmail.invoiceAutomtaticSentMenssage')})</p></strong>
                </div>

                  <TextInput
                    classNameInput='form-control-sm'
                    disabled={isLoadingPostDataEmails}
                    error={errorEmailsData}
                    id='emails'
                    name='emails'
                    noValidate={false}
                    otherId=''
                    readOnly={false}
                    submit={submitPost}
                    type='text'
                    value={emails}
                    onChange={async (e) => {
                      await dispatch(setInvoiceDataProps({ prop: e.target.id, value: e.target.value }))
                      if (submitPost) await validatePostSendInvoiceByEmail(dispatch, emails)
                    }}
                  />
                  {/** text-sm d-flex align-items-start flex-row gap-3 mt-5 mb-5 p-0 */}
                  <div className='form-text'>{strings('modals.sendInvoice.separateEmailsWithCommas')}</div>
                </div>
              </form>
            </div>
            <div className='modal-footer py-2'>
              {/** Btns */}
              <div className='d-flex align-items-center justify-content-center gap-3'>
                <a id='sendEmailModalClose' className='btn btn-sm btn-neutral' data-bs-dismiss='modal' onClick={handleClose}>
                  {strings('button.cancel')}
                </a>
                <button
                  type='button'
                  className='btn btn-sm btn-primary'
                  onClick={handleSendByEmail}
                >
                  <span className='pe-2'>
                    <i className='bi bi-envelope' />
                  </span>
                  {strings('button.send')}
                </button>
                <button
                  type='button'
                  id='modal-open-sendOK'
                  className='d-none'
                  data-bs-target='#modalSendOK'
                  data-bs-toggle='modal'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/** MODAL SEND OK */}
      <div className='modal fade' id='modalSendOK' tabIndex={-1} aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content shadow-4'>
            <div className='modal-body'>
              <div className='text-center py-5 px-5'>
                {/** Icon */}
                <div className='icon icon-shape icon-xl rounded-circle bg-soft-primary text-primary text-2xl'>
                  <i className='bi bi-envelope-check' />
                </div>
                {/** Title */}
                <h3 className='mt-7 mb-n4'>{strings('modals.sendEmail.sendInvoiceSuccessfully')}</h3>
              </div>
            </div>
            <div className='modal-footer justify-content-center pb-5 pt-0 border-top-0'>
              <a role='button' onClick={handleClickClose} className='btn btn-sm btn-neutral' data-bs-dismiss='modal'>{strings('button.close')}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
