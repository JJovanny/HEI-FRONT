import moment from 'moment'
import { apiPostRequestEarlyPayment } from 'src/invoice/InvoiceActions'
import { useSelector, useDispatch } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import { IInvoiceState } from 'src/types/invoice'
import { getRemainingDays } from 'src/utils/dates'
import { formatPrice } from 'src/utils/numbers'
import { discountCalculation } from 'src/validations/numbers'
import InvoiceManager from 'src/invoice/InvoiceManager'

export const PaymentDataModal = () => {
  const dispatch = useDispatch()
  const { invoice, currency } = useSelector(state => state.InvoiceReducer as IInvoiceState)
  const country = invoice?.customer && invoice?.customer?.country && typeof invoice?.customer?.country !== 'string' ? invoice?.customer?.country?.code : ''
  const totalTaxesValidate: number = (invoice.totalTaxes ? invoice.totalTaxes : 0)
  const totalWitTaxes: number = (invoice.grandTotal - totalTaxesValidate)
  const total: number = discountCalculation(totalWitTaxes, invoice.paymentPreferences.dailyDiscountToApply, invoice.dueDate, country, invoice.invoiceDatePaidOrAdvanced)
  const totalToPay = totalWitTaxes - total
  const advanceTotal = (totalToPay).toFixed(2)
  const calculate = (totalWitTaxes - parseFloat(advanceTotal)).toFixed(2)
  const errorTotalPay = totalToPay <= 0
  const symbol = InvoiceManager.getCurrencySymbol(currency)

  return (
    <div className='modal fade' id='early-payment-data' tabIndex={-1} aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered  modal-lg'>
        <div className='modal-content shadow-4'>
          <div className='modal-body'>

            <div className='text-center py-5 px-5'>
              <div className='icon icon-shape icon-xl rounded-circle bg-soft-primary text-primary text-2xl'>
                <i className='bi bi-credit-card-2-front' />
              </div>
              <h3 className='mt-7 mb-7'>{strings('modals.paymentData.title')}</h3>
              <div className=''>
                <div className='col-lg-22 d-flex flex-column gap-3'>

                  <table className='table-borderless'>
                    <thead>
                    <th><h5 className='font-semibold mb-lg-1'>{strings('modals.paymentData.originalTotal')}</h5></th>
                    <th><h5 className='font-semibold ms-1  mb-lg-1'>{strings('modals.paymentData.daysUntilExpiration')}</h5></th>
                    <th><h5 className='font-semibold text-center mb-lg-1'>{strings('modals.paymentData.discount')}</h5></th>
                    <th><h5 className='font-semibold text-start mb-lg-1'>{strings('modals.paymentData.totalWithDiscount')}</h5></th>
                    </thead>
                    <tbody>
                      <tr className='align-items-start'>
                        <td className='col-md-2'>
                          <div className='form-group'>
                            <h5>
                              {strings('global.price', { price: formatPrice(totalWitTaxes.toFixed(2), symbol), symbol })}
                            </h5>
                          </div>
                        </td>
                        <td className='col-md-3'>
                          <div className='form-group ms-3'>
                            <h5>{getRemainingDays(invoice?.dueDate, country, (invoice.invoiceDatePaidOrAdvanced ? moment.utc(invoice.invoiceDatePaidOrAdvanced).format('YYYY-MM-DD') : undefined))} {strings('placeholder.days')}</h5>
                          </div>
                        </td> 
                        <td className='col-md-4'>
                          <div className='form-group'>
                            <h5>
                            {strings('global.price', { price: formatPrice(parseFloat(calculate).toFixed(2), symbol), symbol })}
                            </h5>
                          </div>
                        </td>
                        <td className='col-md-4'>
                          <div className='form-group ml-5'>
                            <h5 className={errorTotalPay ? 'text-danger' : 'text'}>
                              {strings('global.price', { price: formatPrice(totalToPay.toFixed(2), symbol), symbol })}
                            </h5>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className='row align-items-start'>
                    <div className='col-md-12'>
                      {errorTotalPay && (
                        <div className='form-group'>
                          <p className='text-danger'>{strings('modals.paymentData.negativeValue')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='modal-footer justify-content-between py-2'>
            <a className='btn btn-sm btn-neutral' data-bs-dismiss='modal' id='close-invoice-modal'>
              {strings('button.close')}
            </a>
            <button
              disabled={errorTotalPay}
              role='button'
              className={!errorTotalPay ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-secondary'}
              data-bs-dismiss='modal'
              onClick={() => dispatch(apiPostRequestEarlyPayment())}
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
  )
}
