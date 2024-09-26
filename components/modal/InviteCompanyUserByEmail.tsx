import React, { useState } from 'react'
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
import { apiPostInviteUser } from 'src/client/ClientActions'

export const InviteCompanyUserByEmail = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  /** Private methods */
  const handleSendByEmail = async () => {
    await dispatch(apiPostInviteUser(email,name))
    setEmail('')
    setName('')
    handleClickClose() 
  }

  const handleClickClose = () => {
    document.getElementById('sendEmailModalClose')?.click()
  }

  return (
    <>
      <div className='modal fade' id='inviteCompanyUserModal' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex={-1} aria-labelledby='inviteCompanyModal' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered'>
          <div className='modal-content shadow-3'>
            <div className='modal-header py-4'>
              <h5 className='modal-title'>{strings('modals.sendEmail.inviteSupplier')}</h5>
              <div className='text-xs ms-auto'>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
              </div>
            </div>
            <div className='modal-body'>
              {/** Form Enviar Email */}
              <form id='form-send'>
                <div className='form-group mb-3'>
                <div className='d-flex flex-column flex-sm-row justify-content-start mb-2'>
                  <h6 className='me-1 mb-1 mb-sm-0'>{strings('myProfile.email')}</h6>
                </div>
                  <TextInput
                    classNameInput='form-control-sm'
                    id='email'
                    name='email'
                    noValidate={false}
                    otherId=''
                    readOnly={false}
                    type='text'
                    value={email}
                    onChange={async (e) => {
                      setEmail(e.target.value)
                    }}
                  />
                </div>
                <div className='form-group'>
                <div className='d-flex flex-column flex-sm-row justify-content-start mb-2'>
                  <h6 className='me-1 mb-1 mb-sm-0'>{strings('myProfile.name')}</h6>
                </div>
                  <TextInput
                    classNameInput='form-control-sm'
                    id='name'
                    name='name'
                    noValidate={false}
                    otherId=''
                    readOnly={false}
                    type='text'
                    value={name}
                    onChange={async (e) => {
                      setName(e.target.value)
                    }}
                  />
                </div>
              </form>
            </div>
            <div className='modal-footer py-2'>
              {/** Btns */}
              <div className='d-flex align-items-center justify-content-center gap-3'>
                <a id='sendEmailModalClose' className='btn btn-sm btn-neutral' data-bs-dismiss='modal'>
                  {strings('button.cancel')}
                </a>
                <button
                  type='button'
                  className='btn btn-sm btn-primary'
                  disabled={email === '' || name === ''}
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
