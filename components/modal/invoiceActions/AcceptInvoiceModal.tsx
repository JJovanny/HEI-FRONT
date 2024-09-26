/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { strings } from 'src/resources/locales/i18n'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiPatchAcceptInvoice } from 'src/receivedInvoice/ReceivedInvoiceActions'
import { IInvoice } from 'src/types/invoice'
import { IUser } from 'src/types/user'
import { expirationDateWithCurrentDate, getRemainingDays } from 'src/utils/dates'
import { discountCalculation } from 'src/validations/numbers'
import Link from 'next/link'
import Routing from 'src/routing'
import { apiGetUserMe } from 'src/user/UserActions'
import { apiGetCountries } from 'src/country/CountryActions'
import { InvoiceStatus } from 'src/types/enums'
import moment from 'moment'
import { setValuePostInvoiceData } from 'src/invoice/InvoiceActions'

export const AcceptInvoiceModal = ({ route }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [acceptInvoice, setAcceptInvoice] = useState(false)
  const { id, dueDate, issueDate, invoice, invoiceNumber, totalTaxes, paymentPreferencesExternal, selectedFinancialId, grandTotal, isQuickpay, paymentPreferences, invoicePaymentPreferences, supplierPaymentPreferences, myPaymentPreferences, isLoadingReceivedInvoices } = useSelector(({ InvoiceReducer, ReceivedInvoiceReducer, ClientReducer, SupplierReducer, UserReducer }) => {
    const { invoice }: { invoice: IInvoice } = InvoiceReducer
    const { isLoadingReceivedInvoices } = ReceivedInvoiceReducer
    const { supplierPaymentPreferences } = SupplierReducer
    const { paymentPreferences, selectedFinancialId, paymentPreferencesExternal } = ClientReducer
    const { dataUser }: { dataUser: IUser } = UserReducer
    const invoicePaymentPreferences = invoice?.paymentPreferences
    const myPaymentPreferences = dataUser?.paymentPreferences
    const { id, invoiceNumber, totalTaxes, dueDate, issueDate, isQuickpay, grandTotal } = invoice

    return { id, dueDate, issueDate, invoiceNumber, selectedFinancialId, paymentPreferencesExternal, grandTotal, paymentPreferences, totalTaxes, isQuickpay, invoice, invoicePaymentPreferences, supplierPaymentPreferences, myPaymentPreferences, isLoadingReceivedInvoices }
  })
  
  const [numberDaysUntilExpirationDate, setNumberDaysUntilExpirationDate] = useState(paymentPreferences && paymentPreferences?.numberDaysUntilExpirationDate !== undefined ? paymentPreferences?.numberDaysUntilExpirationDate : undefined)
  const [errorMessageWhenExpired, setErrorMessageWhenExpired] = useState(false)
  const [offerCutoffBeforeDueDate, setOfferCutoffBeforeDueDate] = useState(invoicePaymentPreferences?.offerCutoffBeforeDueDate || 7)
  const [days, setDays] = useState(invoicePaymentPreferences?.days || supplierPaymentPreferences?.days || myPaymentPreferences?.days || 0)
  const [allowPaymentInAdvance, setAllowPaymentInAdvance] = useState(paymentPreferences && paymentPreferences?.allowPaymentInAdvance !== undefined ? paymentPreferences?.allowPaymentInAdvance : myPaymentPreferences && myPaymentPreferences?.allowPaymentInAdvance !== undefined ? myPaymentPreferences?.allowPaymentInAdvance : true)
  const [discountInAdvance, setDiscountInAdvance] = useState(invoicePaymentPreferences?.discountInAdvance || supplierPaymentPreferences?.discountInAdvance || myPaymentPreferences?.discountInAdvance || 0)
  const [dailyDiscountToApply, setDailyDiscountToApply] = useState(paymentPreferences && paymentPreferences?.dailyDiscountToApply !== undefined ? paymentPreferences?.dailyDiscountToApply : myPaymentPreferences && myPaymentPreferences?.dailyDiscountToApply !== undefined ? myPaymentPreferences?.dailyDiscountToApply : 0.067)
  const [externalPayment, setExternalPayment] = useState(paymentPreferences && paymentPreferences?.externalPayment !== undefined ? paymentPreferences?.externalPayment : myPaymentPreferences && myPaymentPreferences?.externalPayment !== undefined ? myPaymentPreferences?.externalPayment : false)
  const [errorDailyDiscountToApply, setErrorDailyDiscountToApply] = useState(false)
  const [errorOfferCutoffBeforeDueDate, setErrorOfferCutoffBeforeDueDate] = useState(false)
  const [calculateTotalPay, setCalculateTotalPay] = useState(0)
  const [financialId, setFinancialId] = useState('')
  const [disabledButton, setDisabledButton] = useState(false)
  const [showMessageFinancialNotFound, setShowMessageFinancialNotFound] = useState(false)
  const [showMessagecreditNotAvailable, setShowMessagecreditNotAvailable] = useState(false)
  const country = invoice?.customer && invoice?.customer?.country && typeof invoice?.customer?.country !== 'string' ? invoice?.customer?.country?.code : ''
  const isOverdue = invoice?.status === InvoiceStatus.OVERDUE

  useEffect(() => {
    id && acceptInvoice && dispatch(apiPatchAcceptInvoice(id, days, allowPaymentInAdvance, discountInAdvance, externalPayment, dailyDiscountToApply, offerCutoffBeforeDueDate, dueDate, numberDaysUntilExpirationDate))
    return () => { }
  }, [acceptInvoice, id])

  const handleAcceptClick = () => {
    router.push(route)
  }
 
  useEffect(() => {
    setAllowPaymentInAdvance(isOverdue ? false : (paymentPreferences && paymentPreferences?.allowPaymentInAdvance !== undefined ? paymentPreferences?.allowPaymentInAdvance : myPaymentPreferences && myPaymentPreferences?.allowPaymentInAdvance !== undefined ? (paymentPreferences?.dailyDiscountToApply === undefined ? true : myPaymentPreferences?.allowPaymentInAdvance) : true))
    setDailyDiscountToApply(paymentPreferences && paymentPreferences?.dailyDiscountToApply !== undefined ? paymentPreferences?.dailyDiscountToApply : myPaymentPreferences && myPaymentPreferences?.dailyDiscountToApply !== undefined ? myPaymentPreferences?.dailyDiscountToApply : 0.067)
    setDailyDiscountToApply(paymentPreferences && paymentPreferences?.dailyDiscountToApply !== undefined ? paymentPreferences?.dailyDiscountToApply : myPaymentPreferences && myPaymentPreferences?.dailyDiscountToApply !== undefined ? myPaymentPreferences?.dailyDiscountToApply : 0.067)
    setOfferCutoffBeforeDueDate(paymentPreferences && paymentPreferences?.offerCutoffBeforeDueDate !== undefined ? paymentPreferences?.offerCutoffBeforeDueDate : 7)
    setNumberDaysUntilExpirationDate(paymentPreferences && paymentPreferences?.numberDaysUntilExpirationDate !== undefined ? paymentPreferences?.numberDaysUntilExpirationDate : undefined)
  }, [paymentPreferences, invoice, myPaymentPreferences])

  useEffect(() => {
    if (externalPayment) setDailyDiscountToApply(0)
    if (!allowPaymentInAdvance) setDailyDiscountToApply(0)
  }, [externalPayment, allowPaymentInAdvance])

  
  useEffect(() => {
      if (numberDaysUntilExpirationDate !== undefined && invoice?.status === InvoiceStatus.APPROVAL_PENDING) {
         dispatch(setValuePostInvoiceData({ prop: 'dueDate', value: moment(issueDate).add(numberDaysUntilExpirationDate, 'days').format('YYYY-MM-DD') }))
      }  
  }, [paymentPreferences, numberDaysUntilExpirationDate, issueDate, invoice?.status]) 

  useEffect(() => {
    if (isOverdue) setAllowPaymentInAdvance(false)
  }, [invoice?.status])

  useEffect(() => {
      if (allowPaymentInAdvance) {
        setDisabledButton(errorDailyDiscountToApply || errorOfferCutoffBeforeDueDate)
        !externalPayment ? setDisabledButton(errorDailyDiscountToApply || errorOfferCutoffBeforeDueDate) : setDisabledButton(false) 
      } else {
        setDisabledButton(false) 
      }
    }, [allowPaymentInAdvance,errorDailyDiscountToApply,errorOfferCutoffBeforeDueDate, externalPayment])

  useEffect(() => {
    setFinancialId(selectedFinancialId)
  }, [selectedFinancialId])


  useEffect(() => {
    if (isQuickpay) setAllowPaymentInAdvance(true)
    if (!isQuickpay) setAllowPaymentInAdvance(false)
  }, [isQuickpay])

  const totalTaxesValidate: number = (totalTaxes ? totalTaxes : 0)

  useEffect(() => {
    const total: number = discountCalculation((invoice.grandTotal - totalTaxesValidate), dailyDiscountToApply, dueDate, country, invoice.invoiceDatePaidOrAdvanced)
    const totalToPay = (invoice.grandTotal - totalTaxesValidate) - total
    if (totalToPay <= 0) {
      setErrorDailyDiscountToApply(true)
    } else {
      setErrorDailyDiscountToApply(false)
    }
    setCalculateTotalPay(totalToPay)
  }, [dailyDiscountToApply, invoice.grandTotal, invoice.dueDate])

  useEffect(() => {
    const remainingDays = getRemainingDays(dueDate,country)
    setErrorMessageWhenExpired(false)
    
    if (offerCutoffBeforeDueDate > remainingDays || isNaN(offerCutoffBeforeDueDate)) {
      setErrorOfferCutoffBeforeDueDate(true)
    } else {
      setErrorOfferCutoffBeforeDueDate(false)
    }
  }, [offerCutoffBeforeDueDate, dueDate])

  const handleSwitch = async () => {

    if (!externalPayment === true) {
    
      if (financialId === '' || financialId === undefined) {
        setExternalPayment(false)
        setShowMessageFinancialNotFound(true)
        return
      } 
      let availableCredit = 0
      if (
        paymentPreferencesExternal &&
        paymentPreferencesExternal !== undefined &&
        paymentPreferencesExternal?.availableCredit !== undefined &&
        paymentPreferencesExternal?.availableCredit
      ) {
        availableCredit = paymentPreferencesExternal?.availableCredit
      }

      if (availableCredit === 0 || availableCredit < grandTotal) {
        setExternalPayment(false)
        setShowMessagecreditNotAvailable(true)
        return
      }

  }

    setExternalPayment(!externalPayment)
    setShowMessageFinancialNotFound(false)
    setShowMessagecreditNotAvailable(false)
  }

  const handleClickProfile = async () => {
    document.getElementById('closeModalApprove')?.click()
    dispatch(apiGetUserMe())
    dispatch(apiGetCountries())
    router.push(Routing.profile)
  }

  const handleSetAllowPaymentInAdvance = () => {
    if (isOverdue && expirationDateWithCurrentDate(dueDate)) { 
      setErrorMessageWhenExpired(true)
      setAllowPaymentInAdvance(false)
    } else {
      setErrorMessageWhenExpired(false)
      setAllowPaymentInAdvance(!allowPaymentInAdvance)
    }
  }

  return (
    <>
      <div className='modal fade' id='modalApprove' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex={-1} aria-labelledby='modal_example' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl'>
          <div className='modal-content shadow-3'>
            <div className='modal-header py-4'>
              <h5 className='modal-title'>{strings('invoiceActions.accept.title', { invoiceNumber })}</h5>
              <div className='text-xs ms-auto'>
                <button
                  type='button'
                  id='closeModalApprove'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label={strings('button.close')}
                />
              </div>
            </div>
            <div className='modal-body'>
              {/** Form */}
              <form id='form-approve'>
                <div className='row g-5'>
                <div className='col-6 mb-3'>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='dueDate'>{strings('placeholder.paymentDate') === 'Payment Date' ? 'Payment Date' : 'Fecha de pago'}</label>
                        <input
                          id='dueDate'
                          className='form-control form-control-sm cursor-pointer'
                          type='date'
                          name='dueDate'
                          value={moment.utc(dueDate).format('YYYY-MM-DD')}
                          onFocus={(e) => e.target.showPicker()}
                          onChange={async (e) => {
                            dispatch(setValuePostInvoiceData({ prop: e.target.name, value: e.target.value }))
                          }}
                        />
                    </div>
                  </div>
                  <div className='col-12 mb-3'>
                    <div className='form-group'>
                      <div className='d-flex align-items-center justify-content-start'>
                        <label className='form-label' htmlFor='first_name'>{strings('invoiceActions.accept.advancePayment')}</label>
                        {errorMessageWhenExpired && (<p className='form-label ms-2 text-danger'>{strings('invoiceActions.accept.errorMessageWhenExpired')}</p>)}
                      </div>
                      <div className='form-check form-switch ps-0 d-flex align-items-center justify-content-start gap-4'>
                        {strings('button.no')}
                        <input className='form-check-input m-0' type='checkbox' role='switch' id='flexSwitchCheckDefault' onChange={(e) => {handleSetAllowPaymentInAdvance()}} checked={allowPaymentInAdvance} />
                        {strings('button.yes')}
                      </div>
                    </div>
                  </div>
                  {allowPaymentInAdvance && (
                    <div className='col-12 mb-3'>
                      <div className='form-group'>
                        <label className='form-label' htmlFor='first_name'>{strings('paymentPreferences.whoPayInvoicesReceived')}</label>
                        <div className='form-check form-switch ps-0 d-flex align-items-center justify-content-start gap-4'>
                          {strings('paymentPreferences.myCompany')}
                          <input className='form-check-input m-0' type='checkbox' role='switch' id='switchPayer' onChange={handleSwitch} checked={externalPayment} />
                          {strings('paymentPreferences.myCreditProviders')}
                        </div>
                        {showMessageFinancialNotFound && (
                          <div className='justify-content-start d-flex'>
                            <span style={{ fontSize: '15px'}} className='text-danger'>{strings('placeholder.notFoundFinancial')}</span>
                            <a onClick={(e) => {
                              handleClickProfile()
                            }}
                            style={{ fontSize: '15px', cursor: 'pointer'}} className='ms-1'>{strings('placeholder.clickHere')}</a>
                          </div>
                        )}
                        {showMessagecreditNotAvailable && (
                          <div className='justify-content-start d-flex'>
                            <span style={{ fontSize: '15px'}} className='text-danger'>{strings('placeholder.notCreditLimit')}</span>
                          </div>
                        )}
                      </div>
                    </div>)}
                  {(!externalPayment) && (
                    (allowPaymentInAdvance) && (
                      <>
                        <div className='col-md-6 mb-3'>
                          <div className='form-group'>
                            <label className='form-label' htmlFor='max_percent'>{strings('invoiceActions.accept.dailyDiscount')}</label>
                            <div className='input-group input-group-inline'>
                              <input
                                type='number'
                                disabled={isLoadingReceivedInvoices || !allowPaymentInAdvance || externalPayment}
                                className='form-control'
                                id='max_percent'
                                placeholder='0.00'
                                aria-label='0.00'
                                value={dailyDiscountToApply}
                                min={0}
                                max={100}
                                step={1}
                                onChange={async (e) => {
                                  setDailyDiscountToApply(parseFloat(e.target.value))
                                }}
                              />
                              <span className='input-group-text'>%</span>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-6 mb-0'>
                          <div className='form-group'>
                            <label className='form-label' htmlFor='max_term'>{strings('placeholder.offerCutoffBeforeDueDate')}</label>
                            <div className='input-group input-group-inline'>
                              <input
                                type='number'
                                disabled={isLoadingReceivedInvoices || !allowPaymentInAdvance || externalPayment}
                                className='form-control'
                                id='max_term'
                                min={0}
                                onChange={async (e) => {
                                  setOfferCutoffBeforeDueDate(parseInt(e.target.value))
                                }}
                                value={offerCutoffBeforeDueDate}
                              />
                              <span className='input-group-text'>{strings('placeholder.days')}</span>
                            </div>
                          </div>
                          {errorOfferCutoffBeforeDueDate && (
                            <div className='form-group'>
                              <span className='text-danger' style={{ marginLeft: '5px' }}>{strings('invoiceActions.accept.validDaysRemainingUntilDueDate')}</span>
                            </div>
                          )}
                        </div>
                        <div className='col-md-6 mb-3'>
                          <div className='form-group'>
                            <label className='form-label' htmlFor='max_percent'>{strings('modals.paymentData.totalWithDiscount')}{strings('modals.paymentData.afterTaxes')}</label>
                            <div className={`input-group input-group-inline ${errorDailyDiscountToApply ? 'text-danger' : 'text-success'}`} style={errorDailyDiscountToApply ? { border: '2px solid red' } : { border: '2px solid green' }}>
                              <input
                                type='number'
                                disabled
                                className='form-control'
                                placeholder='0.00'
                                aria-label='0.00'
                                value={calculateTotalPay.toFixed(2)}
                                min={0}
                                max={100}
                                step={1}
                              />
                              <span className='input-group-text'>$</span>
                            </div>
                          </div>
                          {errorDailyDiscountToApply && (
                            <div className='form-group'>
                              <span className='text-danger' style={{ marginLeft: '5px' }}>{strings('modals.paymentData.negativeValue')}</span>
                            </div>
                          )}
                        </div>
                        <div className='col-md-6 mb-0'>
                          <div className='form-group'>
                            <label className='form-label' htmlFor='max_term'>{strings('invoiceActions.accept.daysRemainingUntilDueDate')}</label>
                            <div className='input-group input-group-inline'>
                              <input
                                type='number'
                                disabled
                                className='form-control'
                                id='max_term'
                                placeholder='0.00'
                                aria-label='0.00'
                                min={0}
                                max={100}
                                step={1}
                                value={getRemainingDays(dueDate,country)}
                              />
                              <span className='input-group-text'>{strings('placeholder.days')}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  )}
                </div>
              </form>
            </div>
            <div className='modal-footer justify-content-between py-2'>
              <a
                className='btn btn-sm btn-neutral'
                data-bs-target='#modalViewItem'
                data-bs-toggle='modal'
                onClick={() => document.getElementById('closeModalApprove')?.click()}
              >
                <span className='pe-2'>
                  <i className='bi bi-arrow-return-left' />
                </span>
                {strings('button.back')}
              </a>
              <button
                role='button'
                className={disabledButton ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-primary'}
                onClick={() => {
                  setAcceptInvoice(true)
                  document.getElementById('closeModalApprove')?.click()
                }}
                disabled={disabledButton}
                data-bs-target='#modalApproveOK'
                data-bs-toggle='modal'
              >
                {strings('button.proceed')}
                <span className='ps-2'>
                  <i className='bi bi-arrow-right-circle-fill' />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/** MODAL APPROVE OK */}
      <div className='modal fade' id='modalApproveOK' tabIndex={-1} aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content shadow-4'>
            <div className='modal-body'>
              <div className='text-center py-5 px-5'>
                {/** Icon */}
                <div className='icon icon-shape icon-xl rounded-circle bg-soft-success text-success text-2xl'>
                  <i className='bi bi-check-circle-fill' />
                </div>
                {/** Title */}
                <h3 className='mt-7 mb-n4'>{strings('invoiceActions.accept.successfullyAction')}</h3>
              </div>
            </div>
            <div className='modal-footer justify-content-center pb-5 pt-0 border-top-0'>
              <a role='button' className='btn btn-sm btn-neutral' data-bs-dismiss='modal' onClick={handleAcceptClick}>{strings('button.close')}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
