import React from 'react'
import { strings } from 'src/resources/locales/i18n'
import { InvoiceLinesList } from '../invoice/InvoiceLinesList'
import { InvoiceFilesList } from '../invoice/InvoiceFilesList'
import { SendEmailModal } from './SendEmailModal'
import UserManager from '../../src/user/UserManager'
import ClientManager from '../../src/client/ClientManager'
import InvoiceManager from 'src/invoice/InvoiceManager'
import Loading from 'ui/Loading'
import { IClientList } from 'src/types/client'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { InvoiceStatus } from 'src/types/enums'
import { apiPatchMarkAsPaidInvoice } from 'src/invoice/InvoiceActions'
import { apiGetSupplierPaymentPreferences } from 'src/supplier/SupplierActions'

export const ViewInvoiceModalDashboard = () => {
  const dispatch = useDispatch()

  const { dataUser, invoice, currency, isLoadingGetInvoice } = useSelector(({ InvoiceReducer, UserReducer }) => {
    const { invoice, currency, isLoadingGetInvoice } = InvoiceReducer as any
    const { dataUser } = UserReducer

    return { dataUser, invoice, currency, isLoadingGetInvoice }
  })

  const { customer, supplier, rejectedReason } : {customer: IClientList, supplier: IClientList, rejectedReason?: string} = invoice
  const iAmTheSupplier = invoice?.issued

  /** My company information */
  const myCompanyAddress = UserManager.getCompanyAddress(dataUser)
  const myCompanyName = UserManager.getCompanyName(dataUser)
  const myCompanyCif = UserManager.getCompanyCIF(dataUser)
  const myCompanyRegion = UserManager.getCompanyRegionV2(dataUser) // Siglas
  const myCompanyPostalCode = UserManager.getCompanyPostalCode(dataUser)
  const myCompanyCity = UserManager.getCompanyCity(dataUser)

  /** invoice information */
  const { id, invoiceNumber, issueDate, lines, files, grandTotal, uploaded, status, earlyPaymentRequested } = invoice
  const symbol = InvoiceManager.getCurrencySymbol(currency)
  const label = InvoiceManager.getCurrencyLabel(currency)
  const code = InvoiceManager.getCurrencyCode(currency)
  const invoiceAccepted = status === InvoiceStatus.ACCEPTED

  /** User company information */
  const user = iAmTheSupplier ? customer : supplier
  const userId = ClientManager.getId(user)
  const userCompanyAddress = ClientManager.getCustomerAddress(user)
  const userCompanyName = ClientManager.getCustomerName(user)
  const userCompanyCif = ClientManager.getCustomerCif(user)
  const userCompanyRegion = ClientManager.getCustomerRegion(user) // Siglas
  const userCompanyPostalCode = ClientManager.getCustomerPostalCode(user)
  const userCompanyCity = ClientManager.getCustomerCity(user)

  const showSupplierAddress = ((iAmTheSupplier && (myCompanyPostalCode && myCompanyCity && myCompanyRegion)) ||
  (!iAmTheSupplier && (userCompanyPostalCode && userCompanyCity && userCompanyRegion)))

  const showClientAddress = (!iAmTheSupplier || userCompanyAddress?.length > 0) && ((!iAmTheSupplier && (myCompanyAddress && myCompanyCity && myCompanyPostalCode && myCompanyRegion)) || (iAmTheSupplier && (userCompanyAddress && userCompanyCity && userCompanyPostalCode)))

  const isPending = () => {
    return status === InvoiceStatus.APPROVAL_PENDING
  }

  const canMarkAsPaid = () => {
    return status === InvoiceStatus.ACCEPTED || status === InvoiceStatus.OVERDUE
  }

  const handleRequestEarlyPayment = async () => {
    document.getElementById('close-invoice-modal')?.click()
    document?.getElementById('modal-info-early-payment')?.click()
  }

  function RenderActionsButtons () {
    if (iAmTheSupplier && uploaded) {
      return (
        <div className='d-flex align-items-center justify-content-center gap-3'>
          {invoiceAccepted && !earlyPaymentRequested &&
            <a role='button' className='btn btn-sm btn-secondary' onClick={handleRequestEarlyPayment}>
              <span className='pe-2'>
                <i className='bi bi-credit-card-2-front' />
              </span>
              {strings('button.requestEarlyPayment')}
            </a>}
          <a
            role='button'
            className='btn btn-sm btn-primary'
            onClick={(e) => document.getElementById('close-invoice-modal')?.click()}
            data-bs-target='#modalSend'
            data-bs-toggle='modal'
          >
            <span className='pe-2'>
              <i className='bi bi-envelope' />
            </span>
            {strings('button.sendEmail')}
          </a>
        </div>
      )
    }
    if (!iAmTheSupplier && isPending()) {
      return (
        <div className='d-flex align-items-center justify-content-center gap-3'>
          <a
            role='button'
            className='btn btn-sm btn-danger'
            data-bs-target='#modalDeny'
            data-bs-toggle='modal'
            onClick={(e) => document.getElementById('close-invoice-modal')?.click()}
          >
            <span className='pe-2'>
              <i className='bi bi-x-circle' />
            </span>
            {strings('button.deny')}
          </a>
          <a
            role='button'
            className='btn btn-sm btn-success'
            data-bs-target='#modalApprove'
            data-bs-toggle='modal'
            onClick={async () => {
              await dispatch(apiGetSupplierPaymentPreferences(userId))
              document.getElementById('close-invoice-modal')?.click()
            }}
          >
            <span className='pe-2'>
              <i className='bi bi-check-circle' />
            </span>
            {strings('button.approve')}
          </a>
        </div>
      )
    } else return <></>
  }

  return (
    <>
      <div className='modal fade' id='modalViewInvoiceDashboard' tabIndex={-1} aria-labelledby='modalViewItem' aria-hidden='true' aria-modal='true'>
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg'>
          <div className='modal-content shadow-3'>
            <div className='modal-header py-4 d-none'>
              <h5 className='modal-title'>{strings('title.invoice.viewInvoice')}</h5>
              <div className='text-xs ms-auto'>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
              </div>
            </div>
            {isLoadingGetInvoice ? <div className='m-5'><Loading /></div> : <></>}
            {isLoadingGetInvoice
              ? <></>
              : (// eslint-disable-next-line react/jsx-closing-tag-location
                <div className={isLoadingGetInvoice ? 'd-none' : 'modal-body'}>
                  <div id='factView' className='px-lg-4_ py-lg-2_'>
                    <div className='row align-items-start'>

                      {/** Supplier Info */}
                      <div className='col-md-4 col-xl-4 mb-3 mb-lg-0'>
                        <h3 className='h1 mb-3 mb-md-5'>
                          {strings('placeholder.invoice')}
                        </h3>
                        <div>
                          <label className='form-label mb-1'>{strings('placeholder.from')}</label>
                          <p className='text-sm text-dark mb-3'>
                            <strong>{iAmTheSupplier ? myCompanyName : userCompanyName}</strong><br />
                            {iAmTheSupplier && myCompanyAddress
                              ? myCompanyAddress
                              : !iAmTheSupplier && userCompanyAddress
                                  ? userCompanyAddress
                                  : ''}
                            {((iAmTheSupplier && myCompanyAddress) || (!iAmTheSupplier && userCompanyAddress)) && <br />}
                            {showSupplierAddress &&
                             strings('placeholder.addressWithoutStreet',
                               {
                                 postalCode: iAmTheSupplier ? myCompanyPostalCode : userCompanyPostalCode,
                                 city: iAmTheSupplier ? myCompanyCity : userCompanyCity,
                                 region: iAmTheSupplier ? myCompanyRegion : userCompanyRegion
                               })}
                            {showSupplierAddress && <br />}
                            {((iAmTheSupplier && myCompanyCif) || (!iAmTheSupplier && userCompanyCif)) &&
                            strings('placeholder.cifNumber', { number: iAmTheSupplier ? myCompanyCif : userCompanyCif })}
                          </p>
                        </div>

                        {/** Client info */}
                        <div className='col-md-8'>
                          <label className='form-label mb-1'>{strings('placeholder.to')}</label>
                          <p className='text-sm text-dark'>
                            {(!iAmTheSupplier || userCompanyName?.length > 0) &&
                              <strong>{iAmTheSupplier ? userCompanyName : myCompanyName}<br /></strong>}
                            {!iAmTheSupplier || userCompanyAddress?.length > 0
                              ? showClientAddress && strings('placeholder.addressWithStreet',
                                {
                                  street: iAmTheSupplier ? userCompanyAddress : myCompanyAddress,
                                  postalCode: iAmTheSupplier ? userCompanyPostalCode : myCompanyPostalCode,
                                  city: iAmTheSupplier ? userCompanyCity : myCompanyCity,
                                  region: iAmTheSupplier ? userCompanyRegion : myCompanyRegion
                                })
                              : !myCompanyName && strings('placeholder.invoiceDonthaveclient')}
                            {(showClientAddress || !(!iAmTheSupplier || userCompanyAddress?.length > 0)) && <br />}
                            {!iAmTheSupplier || userCompanyCif?.length > 0
                              ? ((!iAmTheSupplier && myCompanyCif) || (iAmTheSupplier && userCompanyCif)) &&
                               strings('placeholder.cifNumber', { number: iAmTheSupplier ? userCompanyCif : myCompanyCif })
                              : ''}
                          </p>
                        </div>
                      </div>
                      <div className='col-md-8 col-xl-7 offset-xl-1 d-flex flex-column gap-3 gap-md-4 mt-3'>
                        <div className='row g-3 g-lg-4'>
                          <div className='col-md-6'>
                            <div>
                              <label className='form-label mb-1' htmlFor='numId'>{strings('form.placeholder.invoiceNumber')}</label>
                              <p className='text-sm text-dark'>{invoiceNumber || strings('placeholder.invoiceDonthaveNumber')}</p>
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div>
                              <label className='form-label mb-1' htmlFor='date'>{strings('form.placeholder.issueDate')}</label>
                              <p className='text-sm text-dark'>{issueDate.substring(0, 10) || strings('placeholder.invoiceDonthaveIssueDate')}</p> {/** only need 10 positions (yyyy-mm-dd) */}
                            </div>
                          </div>
                        </div>
                        <div className='row g-3 g-lg-4'>

                          {/** Currency info */}
                          <div className='col-md-6'>
                            <div>
                              <label className='form-label mb-1' htmlFor='currency'>{strings('placeholder.currency')}</label>
                              <p className='text-sm text-dark'>
                                {label && code ? strings('placeholder.showCurrency', { label, code }) : strings('placeholder.invoiceDonthaveCurrency')}
                              </p>
                            </div>
                          </div>

                          {!iAmTheSupplier &&
                            <div className='col-md-6'>
                              <div>
                                <label className='form-label mb-1' htmlFor='earlyPaymentRequested'>{strings('placeholder.earlyPaymentRequested')}</label>
                                <p className='text-sm text-dark'>
                                  {earlyPaymentRequested ? strings('button.yes') : strings('button.no')}
                                </p>
                              </div>
                            </div>}
                        </div>

                        {/** rejected invoice information */}
                        {rejectedReason &&
                          <div className='row g-3 g-lg-4'>

                            <div className='col-md-6'>
                              <div>
                                <label className='form-label mb-1' htmlFor='currency'>{strings('placeholder.rejectedReason')}</label>
                                <p className='text-sm text-dark'>
                                  {rejectedReason}
                                </p>
                              </div>
                            </div>
                          </div>}
                      </div>
                    </div>
                    {/** Table invoice */}
                    <section id='form-invoice' className='pt-5 mt-5 pt-xxl-8 mt-xxl-8 border-top-2'>
                      {/** List Group */}
                      <div className='list-group list-group-flush border-bottom mb-5 mt-n6 mt-lg-0'>
                        <div className='list-group-item d-none d-md-block pt-0'>
                          <div className='row align-items-center'>
                            <div className='col-12 col-md-4 font-semibold'>{strings('placeholder.concept')}</div>
                            <div className='col-6 col-md-2 font-semibold'>{strings('placeholder.items')}</div>
                            <div className='col-6 col-md-2 font-semibold'>
                              {symbol ? strings('placeholder.price', { symbol }) : strings('placeholder.priceWithoutSymbol')}
                            </div>
                            <div className='col-4 col-md-2 font-semibold text-end'>{strings('placeholder.tax')}</div>
                            <div className='col-4 col-md-2 font-semibold text-end'>{strings('placeholder.percentage')}</div>
                          </div>
                        </div>

                        {/** Invoice elements/lines */}
                        <div className='list-group-item'>
                          <div className='row align-items-center'>
                            {
                            lines?.map((line, index) =>
                              <InvoiceLinesList
                                key={index}
                                index={index}
                                line={line}
                                onlyView
                              />
                            )
                          }
                          </div>
                        </div>

                      </div>
                      {/** Total */}
                      <div className='col-12 text-end mt-4 mb-10'>
                        <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.total')}</p>
                        <div className='h2'>{strings('global.price', { price: grandTotal?.toString()?.replace('.', ','), symbol })}</div>
                      </div>
                      {/** Attachments */}
                      {files.length > 0
                        ? (
                          <>
                            <div className='card bg-surface-tertiary border shadow-none'>
                              <div className='card-body'>
                                <h4 className='mb-4'>{strings('placeholder.attachment')}</h4>
                                <div className='row g-3'>
                                  {files.map((file, index) =>
                                    <InvoiceFilesList
                                      key={index}
                                      index={index}
                                      fileName={file.filename}
                                      size={file.size}
                                      format={file.format}
                                      path={file.file}
                                      onlyView
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </>)
                        : <></>}
                    </section>
                  </div>
                </div>)}
            <div className='modal-footer justify-content-between py-2'>
              {/** Btns */}
              <div className='d-flex align-items-center justify-content-center gap-3'>
                <a className='btn btn-sm btn-neutral' data-bs-dismiss='modal' id='close-invoice-modal'>
                  {strings('button.close')}
                </a>
              </div>
              <RenderActionsButtons />
            </div>
          </div>
        </div>
      </div>
      {iAmTheSupplier && uploaded ? <SendEmailModal /> : <></>}
    </>
  )
}
