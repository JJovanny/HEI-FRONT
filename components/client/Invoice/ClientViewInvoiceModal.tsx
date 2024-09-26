import React from 'react'
import { strings } from 'src/resources/locales/i18n'
import { InvoiceLinesList } from 'components/invoice/InvoiceLinesList'
import { InvoiceFilesList } from 'components/invoice/InvoiceFilesList'
import { useSelector } from 'src/redux/hooks'

export const ClientViewInvoiceModal = () => {
  const { client: { invoiceDetail } } = useSelector((state) => state.ClientReducer)
  const invoiceNumber = invoiceDetail?.invoiceNumber
  const supplier = invoiceDetail?.supplier
  const customer = invoiceDetail?.customer
  const issueDate = invoiceDetail?.issueDate
  const currency = invoiceDetail?.currency
  const lines = invoiceDetail?.lines
  const files = invoiceDetail?.files
  const grandTotal = invoiceDetail?.grandTotal
  const earlyPaymentRequested = invoiceDetail?.earlyPaymentRequested
  const label = currency?.label
  const code = currency?.code
  const symbol = currency?.symbol
  const rejectedReason = currency?.rejectedReason

  return (
    <>
      <div className='modal fade' id='modalViewInvoiceCustomer' tabIndex={-1} aria-labelledby='modalViewItem' aria-hidden='true' aria-modal='true'>
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg'>
          <div className='modal-content shadow-3'>
            <div className='modal-header py-4 d-none'>
              <h5 className='modal-title'>{strings('title.invoice.viewInvoice')}</h5>
              <div className='text-xs ms-auto'>
                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
              </div>
            </div>

            <div className='modal-body'>
              <div id='factView' className='px-lg-4_ py-lg-2_'>
                <div className='row align-items-start'>
                  <div className='col-md-4 col-xl-4 mb-3 mb-lg-0'>
                    <h3 className='h1 mb-3 mb-md-5'>
                      {strings('placeholder.invoice')}
                    </h3>
                    <div>
                      <label className='form-label mb-1'>{strings('placeholder.from')}</label>
                      <p className='text-sm text-dark mb-3'>
                        <strong>{supplier?.name}</strong><br />
                        {supplier?.address} {supplier?.address && <br />}
                        {(supplier?.postalCode || supplier?.city || supplier?.region) && strings('placeholder.addressWithoutStreet',
                          {
                            postalCode: supplier?.postalCode || '',
                            city: supplier?.city || '',
                            region: supplier?.region || ''
                          })}<br />
                        {supplier?.cif && strings('placeholder.cifNumber', { number: supplier?.cif })}
                      </p>
                    </div>
                    <div className='col-md-8'>
                      <label className='form-label mb-1'>{strings('placeholder.to')}</label>
                      <p className='text-sm text-dark'>
                        <strong>{customer?.name}</strong><br />
                        {(customer?.address || customer?.postalCode || customer?.city || customer?.region) &&
                         strings('placeholder.addressWithStreet',
                           {
                             street: customer?.address || '',
                             postalCode: customer?.postalCode || '',
                             city: customer?.city || '',
                             region: customer?.region || ''
                           })} <br />
                        {customer?.cif && strings('placeholder.cifNumber', { number: customer?.cif })}
                      </p>
                    </div>
                  </div>
                  <div className='col-md-8 col-xl-7 offset-xl-1 d-flex flex-column gap-3 gap-md-4 mt-3'>
                    <div className='row g-3 g-lg-4'>
                      <div className='col-md-6'>
                        <div>
                          <label className='form-label mb-1' htmlFor='numId'>
                            {strings('form.placeholder.invoiceNumber')}
                          </label>
                          <p className='text-sm text-dark'>{invoiceNumber || strings('placeholder.invoiceDonthaveNumber')}</p>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div>
                          <label className='form-label mb-1' htmlFor='date'>
                            {strings('form.placeholder.issueDate')}
                          </label>
                          <p className='text-sm text-dark'>{issueDate?.substring(0, 10) || strings('placeholder.invoiceDonthaveIssueDate')}</p> {/** only need 10 positions (yyyy-mm-dd) */}
                        </div>
                      </div>
                    </div>
                    <div className='row g-3 g-lg-4'>

                      <div className='col-md-6'>
                        <div>
                          <label className='form-label mb-1' htmlFor='currency'>
                            {strings('placeholder.currency')}
                          </label>
                          <p className='text-sm text-dark'>
                            {label && code ? strings('placeholder.showCurrency', { label, code }) : strings('placeholder.invoiceDonthaveCurrency')}
                          </p>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div>
                          <label className='form-label mb-1' htmlFor='earlyPaymentRequested'>
                            {strings('placeholder.earlyPaymentRequested')}
                          </label>
                          <p className='text-sm text-dark'>
                            {earlyPaymentRequested ? strings('button.yes') : strings('button.no')}
                          </p>
                        </div>
                      </div>
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
                <section id='form-invoice' className='pt-5 mt-5 pt-xxl-8 mt-xxl-8 border-top-2'>
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
                  <div className='col-12 text-end mt-4 mb-10'>
                    <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.total')}</p>
                    <div className='h2'>{strings('global.price', { price: grandTotal?.toString()?.replace('.', ','), symbol })}</div>
                  </div>
                  {files?.length > 0
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
                                  isAdmin
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </>)
                    : <></>}
                </section>
              </div>
            </div>

            <div className='modal-footer justify-content-between py-2'>
              <div className='d-flex align-items-center justify-content-center gap-3'>
                <a className='btn btn-sm btn-neutral' data-bs-dismiss='modal' id='close-invoice-modal'>
                  {strings('button.close')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
