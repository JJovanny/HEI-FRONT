import React, { useState } from 'react'
/** actions */
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { IInvoiceState } from 'src/types/invoice'

export const EventRegistration = () => {
  const { invoice } = useSelector(state => state.InvoiceReducer as IInvoiceState)

  const eventRegistration = invoice?.eventRegistration

  return (
    <>
      <div className='modal fade' id='eventRegistration' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex={-1} aria-labelledby='eventRegistration' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered'>
          <div className='modal-content shadow-3'>
            <div className='modal-header py-4'>
              <h5 className='modal-title'>{strings('placeholder.eventRegistration')}</h5>
              <div className='text-xs ms-auto'>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
              </div>
            </div>
            <div className='modal-body'>
              <ul className='list-unstyled'>
                {eventRegistration && (
                  <> 
                    {eventRegistration.approvedByCustomer && (
                      <li className='mt-3'><h4>{strings('placeholder.approvedByCustomer')}:</h4> {eventRegistration.approvedByCustomer}</li>
                    )}
                    {eventRegistration.offerMadeBy && (
                      <li className='mt-3'><h4>{strings('placeholder.offerMadeBy')}:</h4> {eventRegistration.offerMadeBy}</li>
                    )}
                    {eventRegistration.acceptedBy && (
                      <li className='mt-3'><h4>{strings('placeholder.acceptedBy')}:</h4> {eventRegistration.acceptedBy}</li>
                    )}
                    {eventRegistration.approvedBy && (
                      <li className='mt-3'><h4>{strings('placeholder.approvedBy')}:</h4> {eventRegistration.approvedBy}</li>
                    )}
                    {eventRegistration.rejectedBy && (
                      <li className='mt-3'><h4>{strings('placeholder.rejectedBy')}:</h4> {eventRegistration.rejectedBy}</li>
                    )}
                    {eventRegistration.advanceCompletedBy && (
                      <li className='mt-3'><h4>{strings('placeholder.advanceCompletedBy')}:</h4> {eventRegistration.advanceCompletedBy}</li>
                    )}
                    {eventRegistration.paymentCompletedBy && (
                      <li className='mt-3'><h4>{strings('placeholder.paymentCompletedBy')}:</h4> {eventRegistration.paymentCompletedBy}</li>
                    )}
                  </>

                )}
                {(!eventRegistration || Object.keys(eventRegistration).length === 0) && (
                  <span className='text-center'>{strings('placeholder.noEvents')}</span>
                )}
              </ul>
            </div>
            <div className='modal-footer py-2'>
              <div className='d-flex align-items-center justify-content-center gap-3'>
                <a id='sendEmailModalClose' className='btn btn-sm btn-neutral' data-bs-dismiss='modal'>
                  {strings('button.cancel')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
