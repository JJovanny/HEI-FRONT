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
import { EUserType, InvoiceStatus, TypeCompany } from 'src/types/enums'
import { apiGetCurrencies, apiGetInvoice, apiPatchMarkAsPaidInvoice, clearInvoiceData, clearInvoiceDataErrors, setInvoiceDataProps, setIsMarkAsPaidProps } from 'src/invoice/InvoiceActions'
import { apiGetSupplierPaymentPreferences } from 'src/supplier/SupplierActions'
import { apiGetTaxes } from 'src/tax/TaxActions'
import { apiGetSupplierClients } from 'src/client/ClientActions'
import { useRouter } from 'next/router'
import Routing from 'src/routing'
import { handleDownloadPdf } from 'src/api/utils'
import { discountCalculation } from 'src/validations/numbers'
import { expirationDateWithCurrentDate, getDaysExpired, getRemainingDays } from 'src/utils/dates'
import { validateStringTypeField } from 'src/validations/strings'
import { InvoiceEvidenceAdvancePaymentList } from 'components/invoice/InvoiceEvidenceAdvancePaymentList'
import { InvoiceEvidencePaymentToFinancialList } from 'components/invoice/InvoiceEvidencePaymentToFinancialList'
import { formatPrice, getInterestArrearsCalculation, getInvoiceValueCalculations } from 'src/utils/numbers'
import moment from 'moment'
import { EventRegistration } from './EventRegistration'
import Swal from 'sweetalert2';
import { postPin } from 'src/login/LoginActions'
import { IUserState } from 'src/types/user'
import { apiGetUserMe } from 'src/user/UserActions'
import { formatCurrency } from 'src/utils/Utils'

type Props = {
  iAmTheSupplier: boolean
}

export const ViewInvoiceModal = (props: Props) => {
  const dispatch = useDispatch()
  const { iAmTheSupplier } = props
  const router = useRouter()

  const { dataUser, userType, paymentPreferencesExternal, accessToken, invoice, currency, isLoadingGetInvoice } = useSelector(({ InvoiceReducer, UserReducer, ClientReducer }) => {
    const { invoice, currency, isLoadingGetInvoice } = InvoiceReducer as any
    const { dataUser, accessToken } = UserReducer as IUserState
    const { userType } = dataUser
    const { paymentPreferencesExternal } = ClientReducer

    return { dataUser, userType, paymentPreferencesExternal, accessToken, invoice, currency, isLoadingGetInvoice }
  })
  const { customer, supplier, rejectedReason }: { customer: IClientList, supplier: IClientList, rejectedReason?: string } = invoice
  const country = invoice?.customer && invoice?.customer?.country && typeof invoice?.customer?.country !== 'string' ? invoice?.customer?.country?.code : ''
  const [dropdownTotals, setDropDownTotals] = useState(false)
  
  const pinAccess = dataUser?.pinAccess
  const pinSuccess = dataUser?.pinSuccess
  const companyid = dataUser?.companyBranchSelected ? dataUser?.companyBranchSelected['id'] : ''
  const typeCompany = dataUser?.companyBranchSelected ? dataUser?.companyBranchSelected['typeCompany'] : ''
  const accessPin = typeCompany === TypeCompany.CORPORATION && !pinSuccess
  /** My company information */
  const myCompanyAddress = UserManager.getCompanyAddress(dataUser)
  const myCompanyName = UserManager.getCompanyName(dataUser)
  const myCompanyCif = UserManager.getCompanyCIF(dataUser)
  const myCompanyRegion = UserManager.getCompanyRegionV2(dataUser) // Siglas
  const myCompanyPostalCode = UserManager.getCompanyPostalCode(dataUser)
  const myCompanyCity = UserManager.getCompanyCity(dataUser)
  const bankInformation = validateStringTypeField(supplier?.bankInformation)

  /** invoice information */
  const { id, invoiceNumber, customerBasicInformation, observations, isQuickpay, financial, acceptedWhenExpired, issueDate, statusQuickpay, dueDate, invoiceDatePaidOrAdvanced, evidenceAdvancePayment, evidencePaymentToFinancial, paymentPreferences, lines, files, grandTotal, uploaded, status, earlyPaymentRequested } = invoice
  const symbol = InvoiceManager.getCurrencySymbol(currency)
  const label = InvoiceManager.getCurrencyLabel(currency)
  const code = InvoiceManager.getCurrencyCode(currency)

  const isExternal = invoice?.paymentPreferences ? invoice?.paymentPreferences?.externalPayment : false
  const { totalTaxes, taxes, advanceTotal, subtotal, totalWhittTaxes, calculate, totalWhitDiscount } = getInvoiceValueCalculations(invoice)
  const { interestArrearsCalculation, totalInterestArrearsCalculation, isUserPayerOrFinancialAndExternal } = getInterestArrearsCalculation(invoice, paymentPreferencesExternal, totalTaxes, userType)


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

  const isPaid = () => {
    return status === InvoiceStatus.PAID
  }

  const isOverdue = () => {
    return status === InvoiceStatus.OVERDUE
  }

  const isAcepted = () => {
    return status === InvoiceStatus.ACCEPTED
  }

  const isAdvanced = () => {
    return status === InvoiceStatus.ADVANCED
  }

  const isQuickpayStatus = () => {
    return status === InvoiceStatus.QUICKPAY
  }

  const canMarkAsPaid = () => {
    return status === InvoiceStatus.ACCEPTED || status === InvoiceStatus.QUICKPAY_AVAILABLE
  }

  const remainingDays = (isOverdue() || (isQuickpayStatus() && expirationDateWithCurrentDate(dueDate))) && !invoiceDatePaidOrAdvanced ? 0 : getRemainingDays(dueDate, country, (invoiceDatePaidOrAdvanced ? moment.utc(invoiceDatePaidOrAdvanced).format('YYYY-MM-DD') : undefined))

  const handleEditClick = async () => {
    document.getElementById('close-invoice-modal')?.click()
    await dispatch(apiGetInvoice(id))
    router.push(`${Routing.invoices}/${id}`)
    await dispatch(clearInvoiceDataErrors())
    await dispatch(apiGetCurrencies())
    await dispatch(apiGetTaxes())
    await dispatch(apiGetSupplierClients())
  }

  const handleCloseInvoiceModal = async () => {
    document.getElementById('modal-close')?.click()
  }

  const handleMarkisPaid = async () => {
    document.getElementById('close-invoice-modal')?.click()
    await dispatch(setIsMarkAsPaidProps({ prop: 'isMarkPaid', value: true }))
    await dispatch(apiGetInvoice(id))
    document.getElementById('modal-open-view-payment')?.click()
  }

  const handleAdvancePayment = async () => {
    document.getElementById('close-invoice-modal')?.click()
    await dispatch(setIsMarkAsPaidProps({ prop: 'isMarkPaid', value: false }))
    await dispatch(apiGetInvoice(id))
    document.getElementById('modal-open-view-advance-payment')?.click()
  }

  const handleModalApprove = async () => {
    document.getElementById('close-invoice-modal')?.click()
    await dispatch(setIsMarkAsPaidProps({ prop: 'isMarkPaid', value: false }))
    await dispatch(apiGetInvoice(id))
    document.getElementById('modal-open-view-modal-approve')?.click()
  }

  const handleRequestEarlyPayment = async () => {
    if ((userType === EUserType.SUPPLIER || userType === EUserType.BOTH)) {
      document.getElementById('close-invoice-modal')?.click()
      document.getElementById('modal-info-early-payment')?.click()
    }
  }
  

  const handlePin = async () => {
    document.getElementById('close-invoice-modal')?.click()
    
    if (accessPin) {
      const { value: pin } = await Swal.fire({
        title: 'Ingrese el pin',
        input: 'password',
        inputPlaceholder: 'Contraseña',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Necesitas ingresar un pin';
          }
        }
      });

      if (pin) {
        const handleResponse = async (success, response) => {
          if (success) {
            await dispatch(apiGetSupplierPaymentPreferences(userId))
            document.getElementById('close-invoice-modal')?.click()
            document.getElementById('modal-aprrove')?.click()
          } else {
            Swal.fire('Credenciales incorrectas.', '', 'error');
          }
        };

        try {
          await dispatch(postPin(pin, dataUser.id, handleResponse));
        } catch (error) {
        }

      }
      return;
    }

    await dispatch(apiGetSupplierPaymentPreferences(userId))
    document.getElementById('modal-aprrove')?.click()
  }

  function RenderActionsButtons() {
    if (iAmTheSupplier && !uploaded) {
      return (
        <div className='d-flex align-items-center justify-content-center gap-3'>
          {(status === InvoiceStatus.DRAFT) && (
            <a onClick={handleEditClick} className='btn btn-sm btn-primary' style={{ cursor: 'pointer' }}>
              <i className='bi bi-pencil me-1' />
              {strings('button.edit')}
            </a>
          )}
        </div>
      )
    }
    if (iAmTheSupplier && uploaded) {
      return (
        <div className='d-flex align-items-center justify-content-center gap-3'>
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

          {(status === InvoiceStatus.QUICKPAY_AVAILABLE) && (
            <>
              <a onClick={handleRequestEarlyPayment} className='btn btn-sm btn-success' style={{ cursor: 'pointer' }}>
                {strings('button.quickpayAvaiLable')}
              </a>
              <button
                type='button'
                id='modal-info-early-payment'
                className='d-none'
                data-bs-target='#early-payment-data'
                data-bs-toggle='modal'
              />
            </>
          )}

          {(status === InvoiceStatus.APPROVAL_PENDING) && (
            <a onClick={handleEditClick} data-bs-dismiss='modal' className='btn btn-sm btn-primary' style={{ cursor: 'pointer' }}>
              <i className='bi bi-pencil me-1' />
              {strings('button.edit')}
            </a>
          )}

          {isPending() && (
            <>
              <button
                type='button'
                id='modal-close'
                onClick={(e) => document.getElementById('close-invoice-modal')?.click()}
                className='d-none'
                data-bs-target={`#modalDeleteItem-${id}`}
                data-bs-toggle='modal'
              />
              <a
                className='btn btn-sm btn-danger'
                onClick={(e) => handleCloseInvoiceModal()}
                style={{ cursor: 'pointer' }}
              >
                <i className='bi bi-trash me-1' />
                {strings('button.delete')}
              </a>
            </>
          )}
        </div>
      )
    }
    if (!iAmTheSupplier && (isPending() || isOverdue()) && !acceptedWhenExpired) {
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
            data-bs-dismiss='modal'
            onClick={(e) => handlePin()}
          >
            <span className='pe-2'>
              <i className='bi bi-check-circle' />
            </span>
            {strings('button.approve')}
          </a>
          <button
            role='button'
            className='d-none'
            data-bs-target='#modalApprove'
            id="modal-aprrove"
            data-bs-toggle='modal'
          />
        </div>
      )
    }
    if (!iAmTheSupplier && !isPaid() && !isAdvanced() && (!isAcepted() || status === InvoiceStatus.QUICKPAY) && !isOverdue() && !isExternal && (userType === EUserType.PAYER || userType === EUserType.BOTH)) {
      return (
        <div className='d-flex align-items-center justify-content-center gap-3'>
          <a
            role='button'
            className='btn btn-sm btn-primary'
            data-bs-dismiss='modal'
            onClick={(e) => { handleAdvancePayment() }}
          >
            <i className='bi bi-check-circle' />&nbsp;
            {strings('invoiceStatus.advancedTwo')}
          </a>
          <button
            onClick={(e) => handleCloseInvoiceModal()}
            type='button'
            id='modal-open-view-advance-payment'
            className='d-none'
            data-bs-target='#modalViewAdvancePayment'
            data-bs-toggle='modal'
          />
        </div>
      )
    }
    if (!iAmTheSupplier && isAcepted() && isExternal && (userType === EUserType.FINANCIAL)) {
      return (
        <div className='d-flex align-items-center justify-content-center gap-3'>
          <a
            role='button'
            className='btn btn-sm btn-success'
            onClick={(e) => { handleAdvancePayment() }}
          >
            <i className='bi bi-check-circle' />&nbsp;
            {strings('button.offertQuickPay')}
          </a>
          <button
            onClick={(e) => handleCloseInvoiceModal()}
            type='button'
            id='modal-open-view-advance-payment'
            className='d-none'
            data-bs-target='#modalViewAdvancePayment'
            data-bs-toggle='modal'
          />
        </div>
      )
    }
    if (!iAmTheSupplier && (canMarkAsPaid() || acceptedWhenExpired) && !isPaid() && !isExternal && (userType === EUserType.PAYER || userType === EUserType.BOTH)) {
      return (
        <div className='d-flex align-items-center justify-content-center gap-3'>
          <a
            role='button'
            data-bs-dismiss='modal'
            className='btn btn-sm btn-success'
            onClick={(e) => { handleMarkisPaid() }}
          >
            {(isOverdue() && evidenceAdvancePayment !== undefined) && (
              <>
                <span className='pe-2'>
                  <i className='bi bi-cash-coin' />
                </span>
                {strings('title.invoice.viewInvoice')}
              </>
            )}
            {(isOverdue() && evidenceAdvancePayment === undefined) && (
              <>
                <span className='pe-2'>
                  <i className='bi bi-cash-coin' />
                </span>
                {strings('button.markAsPaid')}
              </>
            )}
            {(!isOverdue() && evidenceAdvancePayment !== undefined) && (
              <>
                <span className='pe-2'>
                  <i className='bi bi-cash-coin' />
                </span>
                {strings('button.markAsPaid')}
              </>
            )}
            {(!isOverdue() && evidenceAdvancePayment === undefined) && (
              <>
                <span className='pe-2'>
                  <i className='bi bi-cash-coin' />
                </span>
                {strings('button.markAsPaid')}
              </>
            )}
          </a>
          <button
            onClick={(e) => handleCloseInvoiceModal()}
            type='button'
            id='modal-open-view-advance-payment'
            className='d-none'
            data-bs-target='#modalViewAdvancePayment'
            data-bs-toggle='modal'
          />
          <button
            type='button'
            id='modal-open-view-payment'
            className='d-none'
            data-bs-target='#modalViewAdvancePayment'
            data-bs-toggle='modal'
          />
        </div>
      )
    }
    if (!iAmTheSupplier && canMarkAsPaid() && isExternal && (userType === EUserType.FINANCIAL)) {
      return (
        <div className='d-flex align-items-center justify-content-center gap-3'>
          <a
            role='button'
            data-bs-dismiss='modal'
            className='btn btn-sm btn-success'
            onClick={(e) => { handleMarkisPaid() }}
          >
            <span className='pe-2'>
              <i className='bi bi-cash-coin' />
            </span>
            {strings('button.markAsPaid')}
          </a>
          <button
            onClick={(e) => handleCloseInvoiceModal()}
            type='button'
            id='modal-open-view-advance-payment'
            className='d-none'
            data-bs-target='#modalViewAdvancePayment'
            data-bs-toggle='modal'
          />
          <button
            type='button'
            id='modal-open-view-payment'
            className='d-none'
            data-bs-target='#modalViewPaymentToFinancial'
            data-bs-toggle='modal'
          />
        </div>
      )
    }
    else return <></>
  }

  const handleLogs = () => {
    // document.getElementById('close-invoice-modal')?.click()
    document.getElementById('event')?.click();
  }


  return (
    <>
      <div className='modal fade' id='modalViewItem' tabIndex={-1} aria-labelledby='modalViewItem' aria-hidden='true' aria-modal='true'>
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
                          {(!customerBasicInformation || Object.keys(customerBasicInformation).length === 0) && (
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
                          )}
                          {(customerBasicInformation && Object.keys(customerBasicInformation).length !== 0) && (
                            <p className='text-sm text-dark'>
                              <strong>{customerBasicInformation?.name}<br /></strong>
                              {strings('placeholder.addressWithStreet',
                                {
                                  street: customerBasicInformation?.address,
                                  postalCode: customerBasicInformation?.postalCode,
                                  city: customerBasicInformation?.city,
                                  region: iAmTheSupplier ? userCompanyRegion : myCompanyRegion
                                })
                              }
                              <br />
                              {strings('placeholder.cifNumber', { number: customerBasicInformation?.cif })}
                            </p>
                          )}
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
                          {paymentPreferences?.allowPaymentInAdvance && (
                            <div className='col-md-6'>
                              <div>
                                <label className='form-label mb-1' htmlFor='numId'>{strings('placeholder.dailyInterest')}</label>
                                <p className='text-sm text-dark'>{paymentPreferences?.dailyDiscountToApply || 0}%</p>
                              </div>
                            </div>
                          )}
                          <div className='col-md-6'>
                            <div>
                              <label className='form-label mb-1' htmlFor='date'>{strings('form.placeholder.issueDate')}</label>
                              <p className='text-sm text-dark'>{issueDate.substring(0, 10) || strings('placeholder.invoiceDonthaveIssueDate')}</p> {/** only need 10 positions (yyyy-mm-dd) */}
                            </div>
                          </div>
                          <div className='col-md-6'>
                            <div>
                              <label className='form-label mb-1' htmlFor='date'>{strings('form.placeholder.dueDate')}</label>
                              <p className='text-sm text-dark'>{dueDate ? dueDate.substring(0, 10) : strings('placeholder.invoiceDonthaveDueDate')}</p> {/** only need 10 positions (yyyy-mm-dd) */}
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
                          <div className='col-md-6'>
                            {isExternal && userType === EUserType.PAYER && (statusQuickpay === InvoiceStatus.ADVANCED || statusQuickpay === InvoiceStatus.PAID) ?
                              (
                                <>
                                  <h6 className='mb-2 text-dark'>{strings('placeholder.financialBankingInformation')}</h6>
                                  <p className='text-sm text-dark mb-3'>{financial?.bankInformation?.replace(/\/n/g, '\n')}</p>
                                </>
                              )
                              :
                              (
                                <>
                                  <h6 className='mb-2 text-dark'>{strings('form.placeholder.bankInformation')}</h6>
                                  <p className='text-sm text-dark mb-3'>{bankInformation.replace(/\/n/g, '\n')}</p>
                                </>
                              )
                            }
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

                          {(status === InvoiceStatus.QUICKPAY || status === InvoiceStatus.QUICKPAY_AVAILABLE || status === InvoiceStatus.ADVANCED || status === InvoiceStatus.PAID) && (
                            <div className='col-md-6'>
                              <div>
                                <label className='form-label mb-1' htmlFor='date'>{strings('placeholder.daysInAdvance')}</label>
                                <p className='text-sm text-dark'>{remainingDays ? remainingDays : ''}</p>
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
                              onClick={handleLogs}
                              data-bs-dismiss='modal'
                              className='btn btn-sm btn-warning'>{strings('placeholder.eventRegistration')}</button>
                              
                              <button
                              className='d-none'
                              id="event"
                              data-bs-target='#eventRegistration'
                              data-bs-toggle='modal'/>
                            </div>
                          )}
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
                      <section id='form-invoice' className='pt-2 mt-2 pt-xxl-8 mt-xxl-8 border-top-2'>
                        {(((statusQuickpay === InvoiceStatus.ADVANCED || statusQuickpay === InvoiceStatus.PAID) || statusQuickpay === undefined) && (status === InvoiceStatus.QUICKPAY || status === InvoiceStatus.ADVANCED || status === InvoiceStatus.PAID)) && (
                          <>
                            {(userType === EUserType.SUPPLIER || userType === EUserType.BOTH) && (
                              <>
                                <div className='col-12 text-end mt-2 mb-2'> 
                                  <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.subtotal')}</p>
                                  <div className='h2'>{formatCurrency(country, parseFloat(totalWhittTaxes.toFixed(2)))}</div>
                                </div>
                                <div className='col-12 text-end mt-2 mb-2'>
                                  <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.discount')}</p>
                                  <div className='h2'>{formatCurrency(country, parseFloat(calculate.toFixed(2)))}</div>
                                </div>
                                <div className='col-12 text-end mt-2 mb-2'>
                                  <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.totalAfterDiscount')}</p>
                                  <div className='h2'>{formatCurrency(country, parseFloat(totalWhitDiscount.toFixed(2)))}</div>
                                </div>
                                <div className='col-12 text-end mt-2 mb-2'>
                                  <p className='text-uppercase text-sm font-semibold'>{strings('title.tax.taxes')}</p>
                                  <div className='h2'>{formatCurrency(country, parseFloat(taxes.toFixed(2)))}</div>
                                </div>
                                <div className='col-12 text-end mt-2 mb-2'>
                                  <p className='text-uppercase text-sm font-semibold'>{strings('modals.paymentData.totalWithTaxes')}</p>
                                  <div className='h2'>{formatCurrency(country, parseFloat(calculate === 0 ? grandTotal.toFixed(2) : totalTaxes?.toFixed(2)))} </div>
                                </div>
                              </>
                            )}
                            {(userType === EUserType.PAYER || userType === EUserType.BOTH || userType === EUserType.FINANCIAL) && (
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
                        {(status === InvoiceStatus.QUICKPAY_AVAILABLE) && (
                          <>
                            <div className='col-12 text-end mt-2 mb-2'>
                              <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.subtotal')}</p>
                              <div className='h3'>{formatCurrency(country, parseFloat(totalWhittTaxes.toFixed(2)))}</div>
                            </div>
                            {userType === EUserType.SUPPLIER && (
                              <div className='col-12 text-end mt-2 mb-2'>
                                <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.discount')}</p>
                                <div className='h3'>{formatCurrency(country, parseFloat(calculate.toFixed(2)))}</div>
                              </div>
                            )}
                            {(userType === EUserType.PAYER || userType === EUserType.BOTH) && (
                              <div className='col-12 text-end mt-2 mb-2'>
                                <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.saving')}</p>
                                <div className='h3'>{formatCurrency(country, parseFloat(calculate.toFixed(2)))}</div>
                              </div>
                            )}
                            <div className='col-12 text-end mt-2 mb-2'>
                              <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.totalAfterDiscount')}</p>
                              <div className='h3'>{formatCurrency(country, parseFloat(totalWhitDiscount.toFixed(2)))}</div>
                            </div>
                            <div className='col-12 text-end mt-2 mb-2'>
                              <p className='text-uppercase text-sm font-semibold'>{strings('title.tax.taxes')}</p>
                              <div className='h3'>{formatCurrency(country, parseFloat(taxes.toFixed(2)))}</div>
                            </div>
                            <div className='col-12 text-end mt-2 mb-2'>
                              <p className='text-uppercase text-sm font-semibold'>{strings('modals.paymentData.totalWithTaxes')}</p>
                              <div className='h3'>{formatCurrency(country, parseFloat(calculate === 0 ? grandTotal.toFixed(2) : totalTaxes?.toFixed(2)))}</div>
                            </div>
                          </>
                        )}
                        {(status === InvoiceStatus.ACCEPTED) && (
                          <>
                            <div className='col-12 text-end mt-2 mb-2'>
                              <p className='text-uppercase text-sm font-semibold'>{strings('placeholder.subtotal')}</p>
                              <div className='h3'>{formatCurrency(country, parseFloat(totalWhittTaxes.toFixed(2)))}</div>
                            </div>
                            <div className='col-12 text-end mt-2 mb-2'>
                              <p className='text-uppercase text-sm font-semibold'>{strings('title.tax.taxes')}</p>
                              <div className='h3'>{formatCurrency(country, parseFloat(taxes.toFixed(2)))}</div>
                            </div>
                            <div className='col-12 text-end mt-2 mb-2'>
                              <p className='text-uppercase text-sm font-semibold'>{strings('modals.paymentData.totalWithTaxes')}</p>
                              <div className='h3'>{formatCurrency(country, parseFloat(totalWhittTaxes.toFixed(2)))}</div>
                            </div>
                          </>
                        )}
                        {
                          isUserPayerOrFinancialAndExternal && (
                            <>
                              <div className='col-12 text-end mt-2 mb-2'>
                                <p className='text-uppercase text-sm font-semibold text-danger'>{strings('invoiceActions.accept.interestArrears')}</p>
                                <div className='h2 text-danger'>{formatCurrency(country, parseFloat(interestArrearsCalculation.toFixed(2)))}</div>
                              </div>
                              <div className='col-12 text-end mt-2 mb-10'>
                                <p className='text-uppercase text-sm font-semibold text-danger'>{strings('modals.paymentData.totalDefaultInterest')}</p>
                                <div className='h2 text-danger'>{formatCurrency(country, parseFloat(totalInterestArrearsCalculation.toFixed(2)))}</div>
                              </div>
                            </>
                          )
                        }
                      </section>
                      {/** Attachments */}
                      {(status !== InvoiceStatus.ADVANCED && status !== InvoiceStatus.PAID) && (
                        files.length > 0
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
                          : <></>
                      )}
                      {(status === InvoiceStatus.ADVANCED || status === InvoiceStatus.PAID && userType !== EUserType.FINANCIAL) && (
                        (evidenceAdvancePayment !== undefined && Array.isArray(evidenceAdvancePayment) && evidenceAdvancePayment.length > 0)
                          ? (
                            <>
                              <div>
                                {evidenceAdvancePayment !== undefined && (<h4 className='mb-4'>{strings('placeholder.proofPaymentAttached')}</h4>)}
                              </div>
                              <div className='card bg-surface-tertiary border shadow-none'>
                                <div className='card-body'>
                                  <h4 className='mb-4'>{strings('placeholder.attachment')}</h4>
                                  <div className='row g-3'>
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
                                              onlyView={true}
                                              path={file.file}
                                            />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>)
                          : <></>
                      )}
                      {(status === InvoiceStatus.ADVANCED || status === InvoiceStatus.PAID && userType === EUserType.FINANCIAL) && (
                        (evidencePaymentToFinancial !== undefined && Array.isArray(evidencePaymentToFinancial) && evidencePaymentToFinancial.length > 0)
                          ? (
                            <>
                              <div>
                                {evidencePaymentToFinancial !== undefined && (<h4 className='mb-4'>{strings('placeholder.proofPaymentAttached')}</h4>)}
                              </div>
                              <div className='card bg-surface-tertiary border shadow-none'>
                                <div className='card-body'>
                                  <h4 className='mb-4'>{strings('placeholder.attachment')}</h4>
                                  <div className='row g-3'>
                                    {evidencePaymentToFinancial !== undefined && (
                                      <div className='row g-3 mb-5'>
                                        {evidencePaymentToFinancial.map((file, index) =>
                                          evidencePaymentToFinancial[index]?.remove
                                            ? <div key={index} className='d-none' />
                                            : <InvoiceEvidencePaymentToFinancialList
                                              key={index}
                                              index={index}
                                              fileName={file.filename}
                                              size={file.size}
                                              format={file.format}
                                              onlyView={true}
                                              path={file.file}
                                            />
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>)
                          : <></>
                      )}
                    </section>
                  </div>
                </div>)}
            <div className='modal-footer py-2 d-flex justify-content-between'>
              <div className='d-flex align-items-start justify-content-start gap-3 flex-grow-1'>
                <a className='btn btn-sm btn-neutral' data-bs-dismiss='modal' id='close-invoice-modal'>
                  {strings('button.close')}
                </a>
              </div>

              <div className='d-flex align-items-center justify-content-center gap-5'>
                {(!iAmTheSupplier && isAcepted() && !expirationDateWithCurrentDate(dueDate) && !isExternal && (userType === EUserType.PAYER)) && (
                  <>
                    <a
                      role='button'
                      className='btn btn-sm btn-success'
                      onClick={(e) => { handleModalApprove() }}
                    >
                      <i className='bi bi-check-circle' />&nbsp;
                      {strings('button.offertQuickPay')}
                    </a>
                    <button
                      onClick={(e) => handleCloseInvoiceModal()}
                      type='button'
                      id='modal-open-view-modal-approve'
                      className='d-none'
                      data-bs-target='#modalApprove'
                      data-bs-toggle='modal'
                    />
                  </>
                )}
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
