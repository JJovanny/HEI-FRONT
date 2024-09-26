import React, { useEffect, useState } from 'react'
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
import { EUserType, InvoiceStatus } from 'src/types/enums'
import { apiGetSupplierPaymentPreferences } from 'src/supplier/SupplierActions'
import { validateStringTypeField } from 'src/validations/strings'
import FileInput from 'ui/input/FileInput'
import { apiSendEvidenceAdvancePayment, setPayToFinancialProps, setValuePostInvoiceData } from 'src/invoice/InvoiceActions'
import { InvoiceEvidenceAdvancePaymentList } from 'components/invoice/InvoiceEvidenceAdvancePaymentList'
import { setReceivedInvoiceDataProps } from 'src/receivedInvoice/ReceivedInvoiceActions'
import { discountCalculation } from 'src/validations/numbers'
import { getRemainingDays } from 'src/utils/dates'
import { formatPrice, getInterestArrearsCalculation, getInvoiceValueCalculations } from 'src/utils/numbers'
import moment from 'moment'
import { formatCurrency } from 'src/utils/Utils'

type Props = {
  iAmTheSupplier: boolean,
  isInvoicesQuickPay: boolean
}

export const ViewInvoiceModalAdvancePayment = (props: Props) => {
  const dispatch = useDispatch()
  const [showButtonAdvance, setShowButtonAdvance] = useState(false)
  const [isRemovePresent, setIsRemovePresent] = useState(false)
  const [showMessageError, setShowMessageError] = useState(false)
  const { iAmTheSupplier, isInvoicesQuickPay } = props
  const [dropdownTotals, setDropDownTotals] = useState(false)

  const { dataUser, invoice, userType, currency, paymentPreferencesExternal, isLoadingGetInvoice } = useSelector(({ InvoiceReducer, UserReducer, ClientReducer }) => {
    const { invoice, currency, isLoadingGetInvoice } = InvoiceReducer as any
    const { dataUser } = UserReducer
    const { userType } = dataUser
    const { paymentPreferencesExternal } = ClientReducer

    return { dataUser, invoice, paymentPreferencesExternal, userType, currency, isLoadingGetInvoice }
  })
  const { customer, supplier, rejectedReason }: { customer: IClientList, supplier: IClientList, rejectedReason?: string } = invoice

  /** My company information */
  const myCompanyAddress = UserManager.getCompanyAddress(dataUser)
  const myCompanyName = UserManager.getCompanyName(dataUser)
  const myCompanyCif = UserManager.getCompanyCIF(dataUser)
  const myCompanyRegion = UserManager.getCompanyRegionV2(dataUser) // Siglas
  const myCompanyPostalCode = UserManager.getCompanyPostalCode(dataUser)
  const myCompanyCity = UserManager.getCompanyCity(dataUser)
  const bankInformation = validateStringTypeField(supplier?.bankInformation)

  /** invoice information */
  const { id, invoiceNumber, isQuickpay, customerBasicInformation, observations, acceptedWhenExpired, statusQuickpay, invoiceDatePaidOrAdvanced, paymentPreferences, issueDate, dueDate, lines, evidenceAdvancePayment, grandTotal, uploaded, status, earlyPaymentRequested } = invoice
  const symbol = InvoiceManager.getCurrencySymbol(currency)
  const label = InvoiceManager.getCurrencyLabel(currency)
  const code = InvoiceManager.getCurrencyCode(currency)
  const isExternal = paymentPreferences ? paymentPreferences?.externalPayment : false

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


  useEffect(() => {
    dispatch(setPayToFinancialProps({ prop: 'payToFinancial', value: false }))
  }, [])

  const isAdvancePayment = () => {
    return statusQuickpay === undefined
  }

  const isOverdue = () => {
    return status === InvoiceStatus.OVERDUE
  }

  const isAccepted = () => {
    return invoice.status === InvoiceStatus.ACCEPTED
  }

  const isFinancial = () => {
    return userType === EUserType.FINANCIAL
  }

  const country = invoice?.customer && invoice?.customer?.country && typeof invoice?.customer?.country !== 'string' ? invoice?.customer?.country?.code : ''
  const { totalTaxes, taxes, advanceTotal, subtotal, totalWhittTaxes, calculate, totalWhitDiscount } = getInvoiceValueCalculations(invoice)
  const { interestArrearsCalculation, totalInterestArrearsCalculation, isUserPayerOrFinancialAndExternal } = getInterestArrearsCalculation(invoice, paymentPreferencesExternal, totalTaxes, userType)

  function RenderActionsButtons() {
    if (isAdvancePayment() && (userType === EUserType.PAYER || userType === EUserType.BOTH) && !isExternal) {
      return (
        <div className='d-flex align-items-center justify-content-center gap-3'>
          <button
            className='btn btn-sm btn-success'
            onClick={async () => {
              if (isRemovePresent || !showButtonAdvance) {
                setShowMessageError(true)
                return
              }
              document.getElementById('close-invoice-adance-modal')?.click()
              await dispatch(setReceivedInvoiceDataProps({ prop: 'isLoadingReceivedInvoices', value: true }))
              await dispatch(apiSendEvidenceAdvancePayment(id, isInvoicesQuickPay))
            }}
          >
            <span className='pe-2'>
              <i className='bi bi-check-circle' />
            </span>

            {(!isAccepted() && !isOverdue()) && (strings('button.advancePayment'))}
            {isAccepted() && (strings('button.markAsPaid'))}
            {(isOverdue() && acceptedWhenExpired) && (strings('button.markAsPaid'))}
          </button>
        </div>
      )
    }
    else if (isAdvancePayment() && !isOverdue() && userType === EUserType.FINANCIAL && isExternal) {
      return (
        <div className='d-flex align-items-center justify-content-center gap-3'>
          <button
            className='btn btn-sm btn-primary'
            onClick={async () => {
              if (isRemovePresent || !showButtonAdvance) {
                setShowMessageError(true)
                return
              }
              document.getElementById('close-invoice-adance-modal')?.click()
              await dispatch(setReceivedInvoiceDataProps({ prop: 'isLoadingReceivedInvoices', value: true }))
              await dispatch(apiSendEvidenceAdvancePayment(id, isInvoicesQuickPay))
            }}
          >
            <span className='pe-2'>
              <i className='bi bi-check-circle' />
            </span>
            {strings('invoiceStatus.advanceFinancial')}
          </button>
        </div>
      )
    } else return <></>
  }

  function handleValueChangeInput(prop, eventFiles, isFile) {
    if (isFile) {
      if (eventFiles && eventFiles.length > 0) {
        const reader = new FileReader()
        const fileNameAndType = eventFiles[0].name?.split('.')
        const fileName = fileNameAndType[0].trim()
        const fileType = fileNameAndType[1].trim().toLowerCase()

        reader.readAsDataURL(eventFiles[0])
        reader.onload = (e) => {
          evidenceAdvancePayment.push({
            filename: fileName, remove: false, stream: e?.target?.result + '', size: eventFiles[0].size, format: fileType, file: ''
          })
          dispatch(setValuePostInvoiceData({ prop, value: evidenceAdvancePayment }))
        }
      }
    } else {
      dispatch(setValuePostInvoiceData({ prop, value: eventFiles }))
    }
  }

  useEffect(() => {
    if (evidenceAdvancePayment !== undefined && evidenceAdvancePayment.length !== 0) {
      const isRemove = evidenceAdvancePayment.every(file => file.remove)
      setIsRemovePresent(isRemove)
    }
  }, [invoice])

  useEffect(() => {
    if (evidenceAdvancePayment !== undefined && evidenceAdvancePayment.length !== 0) {
      setShowButtonAdvance(true)
      setShowMessageError(false)
    } else {
      setShowButtonAdvance(false)
    }
  }, [evidenceAdvancePayment, invoice])

  const handleLogs = () => {
    document.getElementById('close-invoice-adance-modal')?.click()
    document.getElementById('event')?.click();
  }

  const remainingDays = (isOverdue() && !invoiceDatePaidOrAdvanced) ? 0 : getRemainingDays(dueDate, country, (invoiceDatePaidOrAdvanced ? moment.utc(invoiceDatePaidOrAdvanced).format('YYYY-MM-DD') : undefined))

  return (
    <>
      <div className='modal fade' id='modalViewAdvancePayment' tabIndex={-1} aria-labelledby='modalViewAdvancePayment' aria-hidden='true' aria-modal='true'>
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg'>
          <div className='modal-content shadow-3'>
            <div className='modal-header py-4 d-none'>
              <h5 className='modal-title'>{strings('title.invoice.viewInvoice')}</h5>
              <div className='text-xs ms-auto'>
                <button type='button' className='btn-close' id='prueba' data-bs-dismiss='modal' aria-label='Close' />
              </div>
            </div>
            {isLoadingGetInvoice ? <div className='m-5'><Loading /></div> : <></>}
            {isLoadingGetInvoice
              ? <></>
              : (// eslint-disable-next-line react/jsx-closing-tag-location
                <div className={isLoadingGetInvoice ? 'd-none' : 'modal-body'}>
                  <div id='factView' className='px-lg-4_ py-lg-2_'>
                    <div className='row align-items-start'>

                      <div className='col-md-4 col-xl-4 mb-3 mb-lg-0'>
                        <h3 className='h1 mb-3 mb-md-5'>
                          {strings('placeholder.invoice')}
                        </h3>
                        <div>
                          <label className='form-label mb-1'>{strings('placeholder.from')}</label>
                          <p className='text-sm text-dark mb-3'>
                            <strong>{userCompanyName}</strong><br />
                            {userCompanyAddress}
                            {((!iAmTheSupplier && userCompanyAddress)) && <br />}
                            {showSupplierAddress &&
                              strings('placeholder.addressWithoutStreet',
                                {
                                  postalCode: userCompanyPostalCode,
                                  city: userCompanyCity,
                                  region: userCompanyRegion
                                })}
                            {showSupplierAddress && <br />}
                            {strings('placeholder.cifNumber', { number: userCompanyCif })}
                          </p>
                        </div>
                        <br />
                        <div>
                          <h6 className='mb-2 text-dark'>{strings('form.placeholder.bankInformation')}</h6>
                          <p className='text-sm text-dark mb-3'>{bankInformation.replace(/\/n/g, '\n')}</p>
                        </div>
                      </div>
                      <div className='col-md-8 col-xl-7 offset-xl-1 d-flex flex-column gap-3 gap-md-4 mt-3'>
                        <div className='row g-3 g-lg-4'>
                          <div className='col-md-12'>
                            <div>
                              <label className='form-label mb-1' htmlFor='numId'>{strings('form.placeholder.invoiceNumber')}</label>
                              <p className='text-sm text-dark'>{invoiceNumber || strings('placeholder.invoiceDonthaveNumber')}</p>
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div>
                              <label className='form-label mb-1' htmlFor='date'>{strings('form.placeholder.dueDate')}</label>
                              <p className='text-sm text-dark'>{dueDate ? dueDate.substring(0, 10) : strings('placeholder.invoiceDonthaveDueDate')}</p>
                            </div>
                          </div>
                          {paymentPreferences?.allowPaymentInAdvance && (
                            <div className='col-md-6'>
                              <div>
                                <label className='form-label mb-1' htmlFor='date'>{strings('placeholder.daysInAdvance')}</label>
                                <p className='text-sm text-dark'>{(remainingDays || remainingDays === 0) ? remainingDays : ''}</p>
                              </div>
                            </div>
                          )}
                          <div className='col-md-6'>
                            <div>
                              <label className='form-label mb-1' htmlFor='date'>{strings('placeholder.observations')}</label>
                              <p className='text-sm text-dark'>{observations ? observations : strings('placeholder.noObservations')}</p>
                            </div>
                          </div>
                          {userType === EUserType.PAYER && (
                            <div className='col-md-6'>
                              <button
                              onClick={(e) => {handleLogs()}}
                              className='btn btn-sm btn-warning'>{strings('placeholder.eventRegistration')}</button>
                              
                              <button
                              className='d-none'
                              id="event"
                              data-bs-target='#eventRegistration'
                              data-bs-toggle='modal'/>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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
                    <section id='form-invoice' className='pt-2 mt-2 pt-xxl-8 mt-xxl-8 border-top-2'>

                      {(userType === EUserType.SUPPLIER) && (
                        <>
                          <div className='col-12 text-end mt-2 mb-2'>
                            <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.subtotal')}</p>
                            <div className='h2'>{formatCurrency(country, parseFloat(totalWhittTaxes.toFixed(2)))}</div>
                          </div>

                          {(invoice?.status === InvoiceStatus.QUICKPAY || invoice.status === InvoiceStatus.ADVANCED || invoice.status === InvoiceStatus.PAID) && (
                            <>
                              <div className='col-12 text-end mt-2 mb-2'>
                                <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.discount')}</p>
                                <div className='h2'>{formatCurrency(country, parseFloat(calculate.toFixed(2)))}</div>
                              </div>
                              <div className='col-12 text-end mt-2 mb-2'>
                                <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.totalAfterDiscount')}</p>
                                <div className='h2'>{formatCurrency(country, parseFloat(totalWhitDiscount.toFixed(2)))}</div>
                              </div>
                            </>
                          )}
                          <div className='col-12 text-end mt-2 mb-2'>
                            <p className='text-uppercase text-sm font-semibold'>{strings('title.tax.taxes')}</p>
                            <div className='h2'>{formatCurrency(country, parseFloat(taxes.toFixed(2)))}</div>
                          </div>
                          <div className='col-12 text-end mt-2 mb-10'>
                            <p className='text-uppercase text-sm font-semibold'>{strings('modals.paymentData.totalWithTaxes')}</p>
                            <div className='h2'>{formatCurrency(country, parseFloat(calculate === 0 ? grandTotal.toFixed(2) : totalTaxes?.toFixed(2)))}</div>
                          </div>
                        </>
                      )}
                      {(userType === EUserType.PAYER) && (
                        <>
                          {(invoice?.status === InvoiceStatus.QUICKPAY_AVAILABLE) && (
                            <>
                              <div className='col-12 text-end mt-2 mb-2'>
                                <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.subtotal')}</p>
                                <div className='h2'>{formatCurrency(country, parseFloat(totalWhittTaxes.toFixed(2)))}</div>
                              </div>
                              <div className='col-12 text-end mt-2 mb-2'>
                                <p className='text-uppercase text-sm font-semibold'>{strings('title.tax.taxes')}</p>
                                <div className='h2'>{formatCurrency(country, parseFloat(taxes.toFixed(2)))}</div>
                              </div>
                              <div className='col-12 text-end mt-2 mb-10'>
                                <p className='text-uppercase text-sm font-semibold'>{strings('modals.paymentData.totalWithTaxes')}</p>
                                <div className='h2'>{formatCurrency(country, parseFloat(calculate === 0 ? grandTotal.toFixed(2) : totalTaxes?.toFixed(2)))}</div>
                              </div>
                            </>
                          )}
                          {(invoice?.status === InvoiceStatus.ACCEPTED) && (
                            <>
                              <div className='col-12 text-end mt-2 mb-2'>
                                <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.subtotal')}</p>
                                <div className='h2'>{formatCurrency(country, parseFloat(totalWhittTaxes.toFixed(2)))}</div>
                              </div>
                              <div className='col-12 text-end mt-2 mb-2'>
                                <p className='text-uppercase text-sm font-semibold'>{strings('title.tax.taxes')}</p>
                                <div className='h2'>{formatCurrency(country, parseFloat(taxes.toFixed(2)))}</div>
                              </div>
                              <div className='col-12 text-end mt-2 mb-10'>
                                <p className='text-uppercase text-sm font-semibold'>{strings('modals.paymentData.totalWithTaxes')}</p>
                                <div className='h2'>{formatCurrency(country, parseFloat(totalWhittTaxes.toFixed(2)))}</div>
                              </div>
                            </>
                          )}
                          {(invoice?.status === InvoiceStatus.QUICKPAY || invoice.status === InvoiceStatus.ADVANCED || invoice.status === InvoiceStatus.PAID) && (
                            <>
                              <div className='col-12 text-end mt-2 mb-2'>
                                <p className='h2 text-uppercase text-sm text-primary'>{strings('modals.paymentData.originalTotal')}</p>
                                <div className='h2'>{formatCurrency(country, parseFloat(subtotal.toFixed(2)))}</div>
                              </div>
                              {!dropdownTotals && (
                                <div className='col-12 text-end mt-2 mb-2'>
                                  <p className='h2 text-uppercase text-sm text-primary'>{strings('placeholder.totalToPay')}</p>
                                  <div className='h2'>{formatCurrency(country, parseFloat(calculate === 0 ? grandTotal.toFixed(2) : totalTaxes?.toFixed(2)))}</div>
                                </div>
                              )}

                              <div className='col-12 text-end mt-3 mb-3'>
                                <h4 onClick={(e) => { setDropDownTotals(!dropdownTotals) }} className='cursor-pointer text-uppercase text-dark'>{strings('placeholder.seeAdvanceBreakdown')}
                                  &nbsp;
                                  {!dropdownTotals ?
                                    <i className='bi bi-chevron-down' />
                                    :
                                    <i className='bi bi-chevron-up' />
                                  }
                                </h4>
                              </div>
                              {dropdownTotals && (
                                <>
                                  <div className='col-12 text-end mt-2 mb-2'>
                                    <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.saving')}</p>
                                    <div className='h3'>{formatCurrency(country, parseFloat(calculate.toFixed(2)))}</div>
                                  </div>
                                  <div className='col-12 text-end mt-2 mb-2'>
                                    <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.totalAfterDiscount')}</p>
                                    <div className='h3'>{formatCurrency(country, parseFloat(totalWhitDiscount.toFixed(2)))}</div>
                                  </div>
                                  <div className='col-12 text-end mt-2 mb-2'>
                                    <p className='text-uppercase text-sm font-semibold'>{strings('title.tax.taxes')}</p>
                                    <div className='h3'>{formatCurrency(country, parseFloat(taxes.toFixed(2)))}</div>
                                  </div>
                                  <div className='col-12 text-end mt-2 mb-2'>
                                    <p className='h2 text-uppercase text-sm text-primary'>{strings('placeholder.totalToPay')}</p>
                                    <div className='h3'>{formatCurrency(country, parseFloat(calculate === 0 ? grandTotal.toFixed(2) : totalTaxes?.toFixed(2)))}</div>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                       {(userType === EUserType.FINANCIAL) && (
                        <>
                          {(invoice?.status === InvoiceStatus.QUICKPAY || invoice.status === InvoiceStatus.ADVANCED || invoice.status === InvoiceStatus.PAID) && (
                            <>
                              <div className='col-12 text-end mt-2 mb-2'>
                                <p className='h2 text-uppercase text-sm text-primary'>{strings('modals.paymentData.originalTotal')}</p>
                                <div className='h2'>{formatCurrency(country, parseFloat(subtotal.toFixed(2)))}</div>
                              </div>
                              {!dropdownTotals && (
                                <div className='col-12 text-end mt-2 mb-2'>
                                  <p className='h2 text-uppercase text-sm text-primary'>{strings('placeholder.totalToPay')}</p>
                                  <div className='h2'>{formatCurrency(country, parseFloat(calculate === 0 ? grandTotal.toFixed(2) : totalTaxes?.toFixed(2)))}</div>
                                </div>
                              )}

                              <div className='col-12 text-end mt-3 mb-3'>
                                <h4 onClick={(e) => { setDropDownTotals(!dropdownTotals) }} className='cursor-pointer text-uppercase text-dark'>{strings('placeholder.seeAdvanceBreakdown')}
                                  &nbsp;
                                  {!dropdownTotals ?
                                    <i className='bi bi-chevron-down' />
                                    :
                                    <i className='bi bi-chevron-up' />
                                  }
                                </h4>
                              </div>
                              {dropdownTotals && (
                                <>
                                  <div className='col-12 text-end mt-2 mb-2'>
                                    <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.saving')}</p>
                                    <div className='h3'>{formatCurrency(country, parseFloat(calculate.toFixed(2)))}</div>
                                  </div>
                                  <div className='col-12 text-end mt-2 mb-2'>
                                    <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.totalAfterDiscount')}</p>
                                    <div className='h3'>{formatCurrency(country, parseFloat(totalWhitDiscount.toFixed(2)))}</div>
                                  </div>
                                  <div className='col-12 text-end mt-2 mb-2'>
                                    <p className='text-uppercase text-sm font-semibold'>{strings('title.tax.taxes')}</p>
                                    <div className='h3'>{formatCurrency(country, parseFloat(taxes.toFixed(2)))}</div>
                                  </div>
                                  <div className='col-12 text-end mt-2 mb-2'>
                                    <p className='h2 text-uppercase text-sm text-primary'>{strings('placeholder.totalToPay')}</p>
                                    <div className='h3'>{formatCurrency(country, parseFloat(calculate === 0 ? grandTotal.toFixed(2) : totalTaxes?.toFixed(2)))}</div>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                      {
                        isUserPayerOrFinancialAndExternal && (
                          <>
                            <div className='col-12 text-end mt-2 mb-2'>
                              <p className='text-uppercase text-sm font-semibold text-danger'>{strings('invoiceActions.accept.interestArrears')}</p>
                              <div className='h2'>{formatCurrency(country, parseFloat(interestArrearsCalculation.toFixed(2)))}</div>
                            </div>
                            <div className='col-12 text-end mt-2 mb-10'>
                              <p className='text-uppercase text-sm font-semibold text-danger'>{strings('modals.paymentData.totalDefaultInterest')}</p>
                              <div className='h2'>{formatCurrency(country, parseFloat(totalInterestArrearsCalculation.toFixed(2)))}</div>
                            </div>
                          </>
                        )
                      }
                    </section>
                    {(!isOverdue() && isFinancial()) && (
                      <>
                        {showMessageError && (<h4 className='mb-4 text-danger'>{strings('placeholder.provideProofPayment')}</h4>)}
                        {evidenceAdvancePayment !== undefined && (<h4 className='mb-4'>{strings('placeholder.proofPaymentAttached')}</h4>)}
                        {evidenceAdvancePayment === undefined && (<h4 className='mb-4'>{strings('placeholder.evidenceFilesUpload')}</h4>)}
                      </>
                    )}
                    {(!isOverdue() && isFinancial()) && (
                      <div className='card bg-surface-tertiary border shadow-none'>
                        <div className='card-body'>
                          <h4 className='mb-4'>{strings('placeholder.attachment')}</h4>
                          {evidenceAdvancePayment !== undefined && (
                            <div className='row g-3 mb-5'>
                              {evidenceAdvancePayment.map((file, index) =>
                                evidenceAdvancePayment[index]?.remove
                                  ? <div key={index} className='d-none' />
                                  : <InvoiceEvidenceAdvancePaymentList
                                    key={index}
                                    index={index}
                                    fileName={file.filename}
                                    size={file.size}
                                    format={file.format}
                                    onlyView={isAdvancePayment() ? false : true}
                                    path={file.file}
                                  />
                              )}
                            </div>
                          )}
                          {isAdvancePayment() && (
                            <div className='form-group'>
                              <FileInput
                                classNameInput='d-none'
                                id='evidenceAdvancePayment'
                                labelText={strings('placeholder.dragOrSelectDocuments')}
                                types='PDF, DOC, DOCX, XML, PNG, JPG, JPEG'
                                accept='.pdf,.doc,.docx,.xml,.png,.jpg,.jpeg'
                                maxSize={10}
                                submit={false}
                                onChange={(e) => handleValueChangeInput(e.target.id, e.target.files, true)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {(!isOverdue() && !isFinancial()) && (
                      <>
                        {showMessageError && (<h4 className='mb-4 text-danger'>{strings('placeholder.provideProofPayment')}</h4>)}
                        {evidenceAdvancePayment !== undefined && (<h4 className='mb-4'>{strings('placeholder.proofPaymentAttached')}</h4>)}
                        {evidenceAdvancePayment === undefined && (<h4 className='mb-4'>{strings('placeholder.evidenceFilesUpload')}</h4>)}
                      </>
                    )}
                    {(!isOverdue() && !isFinancial()) && (
                      <div className='card bg-surface-tertiary border shadow-none'>
                        <div className='card-body'>
                          <h4 className='mb-4'>{strings('placeholder.attachment')}</h4>
                          {evidenceAdvancePayment !== undefined && (
                            <div className='row g-3 mb-5'>
                              {evidenceAdvancePayment.map((file, index) =>
                                evidenceAdvancePayment[index]?.remove
                                  ? <div key={index} className='d-none' />
                                  : <InvoiceEvidenceAdvancePaymentList
                                    key={index}
                                    index={index}
                                    fileName={file.filename}
                                    size={file.size}
                                    format={file.format}
                                    onlyView={isAdvancePayment() ? false : true}
                                    path={file.file}
                                  />
                              )}
                            </div>
                          )}
                          {isAdvancePayment() && (
                            <div className='form-group'>
                              <FileInput
                                classNameInput='d-none'
                                id='evidenceAdvancePayment'
                                labelText={strings('placeholder.dragOrSelectDocuments')}
                                types='PDF, DOC, DOCX, XML, PNG, JPG, JPEG'
                                accept='.pdf,.doc,.docx,.xml,.png,.jpg,.jpeg'
                                maxSize={10}
                                submit={false}
                                onChange={(e) => handleValueChangeInput(e.target.id, e.target.files, true)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {(isOverdue() && acceptedWhenExpired && !isFinancial()) && (
                      <>
                        {showMessageError && (<h4 className='mb-4 text-danger'>{strings('placeholder.provideProofPayment')}</h4>)}
                        {evidenceAdvancePayment !== undefined && (<h4 className='mb-4'>{strings('placeholder.proofPayment')}</h4>)}
                        {evidenceAdvancePayment === undefined && (<h4 className='mb-4'>{strings('placeholder.evidenceFilesUpload')}</h4>)}
                      </>
                    )}
                    {(isOverdue() && acceptedWhenExpired && !isFinancial()) && (
                      <div className='card bg-surface-tertiary border shadow-none'>
                        <div className='card-body'>
                          <h4 className='mb-4'>{strings('placeholder.attachment')}</h4>
                          {evidenceAdvancePayment !== undefined && (
                            <div className='row g-3 mb-5'>
                              {evidenceAdvancePayment.map((file, index) =>
                                evidenceAdvancePayment[index]?.remove
                                  ? <div key={index} className='d-none' />
                                  : <InvoiceEvidenceAdvancePaymentList
                                    key={index}
                                    index={index}
                                    fileName={file.filename}
                                    size={file.size}
                                    format={file.format}
                                    onlyView={isAdvancePayment() ? false : true}
                                    path={file.file}
                                  />
                              )}
                            </div>
                          )}
                          {(isOverdue() && acceptedWhenExpired && !isFinancial()) && (
                            <div className='form-group'>
                              <FileInput
                                classNameInput='d-none'
                                id='evidenceAdvancePayment'
                                labelText={strings('placeholder.dragOrSelectDocuments')}
                                types='PDF, DOC, DOCX, XML, PNG, JPG, JPEG'
                                accept='.pdf,.doc,.docx,.xml,.png,.jpg,.jpeg'
                                maxSize={10}
                                submit={false}
                                onChange={(e) => handleValueChangeInput(e.target.id, e.target.files, true)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>)}
            <div className='modal-footer justify-content-between py-2'>
              <div className='d-flex align-items-center justify-content-center gap-3'>
                <a className='btn btn-sm btn-neutral' data-bs-dismiss='modal' id='close-invoice-adance-modal'>
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
