import React, { useEffect, useState } from 'react'
/** actions */
import {
  setInvoiceDataProps,
  setValuePostInvoiceData,
  postCalculatePrice,
  validatePostInvoice
} from 'src/invoice/InvoiceActions'
/** components */
import TextInput from '../../ui/input/TextInput'
/** resources */
import { strings } from 'src/resources/locales/i18n'
import SelectInput from 'ui/input/SelectInput'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { ITax } from 'src/types/tax'
import { IInvoiceState, ILines } from 'src/types/invoice'
import TaxManager from 'src/tax/TaxManager'
import { IClient } from 'src/types/client'
import { isSpanishCountryCode } from 'src/utils/Utils'
import { IUserState } from 'src/types/user'
import Swal from 'sweetalert2'

export const InvoiceLinesList = ({ index, line, onlyView }: { index: number, line: ILines, onlyView: boolean }) => {
  const dispatch = useDispatch()
  const { invoice, isLoadingPostDataInvoice, errorInvoiceData, submitPost, defaultTaxes, supplierTaxes } = useSelector(({ InvoiceReducer, TaxReducer }) => {
    const { invoice, isLoadingPostDataInvoice, errorInvoiceData, submitPost } = InvoiceReducer as IInvoiceState
    const { defaultTaxes, supplierTaxes } = TaxReducer

    return { invoice, isLoadingPostDataInvoice, errorInvoiceData, submitPost, defaultTaxes, supplierTaxes }
  })
  const { dataUser: { companyBranchSelected } } = useSelector(state => state.UserReducer)

  interface Tax {
    id: string;
    value: string;
  }

  const [taxes, setTaxes] = useState<Tax[]>([]);
  const { lines } = invoice
  const { concept, items, amount, tax } = line


  const getTaxes = () => {
    const taxes: ITax[] = []
    defaultTaxes.map((tax) => taxes.push(tax))
    supplierTaxes.map((tax) => taxes.push(tax))
    const country = companyBranchSelected !== undefined && companyBranchSelected['country'] && typeof companyBranchSelected['country'] === 'object' ? companyBranchSelected['country']['code'] : ''

    return taxes.map((tax) => {
      return { id: tax.id, value: tax.name === 'Without tax' && isSpanishCountryCode(country) ? 'Sin impuestos' : tax.name }
    })
  }

  useEffect(() => {
    setTaxes(getTaxes())
  }, [invoice?.customer])


  const getTaxPercentage = () => {
    let taxPercentage = -1
    // eslint-disable-next-line array-callback-return
    defaultTaxes.find((dTax) => {
      if ((typeof (tax) === 'string' && dTax.id === tax) || (typeof (tax) === 'object' && dTax.id === tax?.id)) {
        taxPercentage = dTax.percentage
      }
    })

    if (taxPercentage < 0) {
      // eslint-disable-next-line array-callback-return
      supplierTaxes.find((sTax) => {
        if ((typeof (tax) === 'string' && sTax.id === tax) || (typeof (tax) === 'object' && sTax.id === tax?.id)) {
          taxPercentage = sTax.percentage
        }
      })
    }

    if (tax && typeof tax === 'object') taxPercentage = tax.percentage

    return taxPercentage < 0 ? '-' : taxPercentage + '%'
  }

  const validateAmount = (value) => {
    if (Number(value) <= 0) {
      return false;
    }
    return true;
  };

  const handleChange = async (e) => {
    const value = e.target.value;
    // if (!validateAmount(value)) {
    //   await Swal.fire({
    //     icon: 'error',
    //     title: strings('placeholder.invalidValue'),
    //     text:  strings('placeholder.cantBe0'),
    //     toast: true,
    //     position: 'top-end',
    //     showConfirmButton: false,
    //     timer: 3000,
    //     timerProgressBar: true,
    //     didOpen: (toast) => {
    //       toast.addEventListener('mouseenter', Swal.stopTimer);
    //       toast.addEventListener('mouseleave', Swal.resumeTimer);
    //     }
    //   });
    //   return;
    // }
    lines[index].amount = value;
    await dispatch(setValuePostInvoiceData({ prop: 'lines', value: lines }));
    submitPost && dispatch(validatePostInvoice());
  };

  const handleBlur = async () => {
    // if (!validateAmount(amount)) {
    //   await Swal.fire({
    //     icon: 'error',
    //     title: strings('placeholder.invalidValue'),
    //     text:  strings('placeholder.cantBe0'),
    //     toast: true,
    //     position: 'top-end',
    //     showConfirmButton: false,
    //     timer: 3000,
    //     timerProgressBar: true,
    //     didOpen: (toast) => {
    //       toast.addEventListener('mouseenter', Swal.stopTimer);
    //       toast.addEventListener('mouseleave', Swal.resumeTimer);
    //     }
    //   });
    //   return;
    // }
    dispatch(postCalculatePrice());
  };

  return (
    <>
      <div className={onlyView ? 'col-6 col-md-4' : 'col-12 col-md-3'}>
        <TextInput
          classNameInput='form-control-flush text-sm mb-3 mb-md-0'
          disabled={isLoadingPostDataInvoice || onlyView}
          error={errorInvoiceData}
          id={'concept ' + index}
          name='concept'
          noValidate={false}
          otherId=''
          placeholder={strings('placeholder.concept')}
          readOnly={false}
          submit={submitPost}
          type='text'
          value={concept}
          onChange={async (e) => {
            lines[index].concept = e.target.value
            await dispatch(setValuePostInvoiceData({ prop: 'lines', value: lines }))
            submitPost && dispatch(validatePostInvoice())
          }}
        />
      </div>
      <div className={onlyView ? 'col-6 col-md-2' : 'col-4 col-md-2'}>
        <TextInput
          classNameInput='form-control-flush text-sm'
          disabled={isLoadingPostDataInvoice || onlyView}
          error={errorInvoiceData}
          id={'items ' + index}
          name='items'
          noValidate={false}
          otherId=''
          placeholder='1'
          readOnly={false}
          submit={submitPost}
          type='number'
          value={items}
          min={1}
          onBlur={async () => {
            dispatch(postCalculatePrice())
          }}
          onChange={async (e) => {
            lines[index].items = e.target.value
            await dispatch(setValuePostInvoiceData({ prop: 'lines', value: lines }))
            submitPost && dispatch(validatePostInvoice())
          }}
        />
      </div>
      <div className='col-6 col-md-2'>
        <TextInput
          classNameInput='form-control-flush text-sm'
          disabled={isLoadingPostDataInvoice || onlyView}
          error={errorInvoiceData}
          id={'amount ' + index}
          name='amount'
          noValidate={false}
          otherId=''
          placeholder='0,00'
          readOnly={false}
          submit={submitPost}
          type='number'
          value={amount}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>
      <div className={onlyView ? 'col-6 col-md-2 text-end' : 'col-6 col-md-2'}>
        <SelectInput
          classNameSelect={`form-control-flush text-sm text-end ${onlyView ? '' : 'cursor-pointer'}`}
          disabled={isLoadingPostDataInvoice || onlyView}
          error={errorInvoiceData}
          dataChildren={taxes}
          getItemId // true
          hasMultiple={false}
          id={'tax ' + index}
          noValidate={false}
          showSelect
          strDefaultSelect={
            onlyView
              ? typeof tax === 'object' ? TaxManager.getName(tax) : '-'
              : strings('placeholder.chooseWithId', { id: strings('placeholder.tax').toLowerCase() })
          }
          value={typeof tax === 'string' ? tax : TaxManager.getId(tax)}
          submit={submitPost}
          onChange={async (e) => {
            lines[index].tax = e.target.value
            await dispatch(setValuePostInvoiceData({ prop: 'lines', value: lines }))
            submitPost && dispatch(validatePostInvoice())
            dispatch(postCalculatePrice())
          }}
        />
      </div>
      <div className={onlyView ? 'col-6 col-md-2 text-end' : 'col-6 col-md-2 text-end'}>
        <p>{getTaxPercentage()}</p>
      </div>
      {onlyView
        ? <></>
        : (
          <>
            <div className='col-2 col-md-1 text-end'>
              <div className='dropdown'>
                <a className='btn btn-xs btn-square btn-neutral' href='#' role='button' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                  <i className='bi bi-three-dots-vertical' />
                </a>
                <div className='dropdown-menu dropdown-menu-end'>
                  <a
                    className='dropdown-item cursor-pointer'
                    onClick={(e) => {
                      dispatch(setInvoiceDataProps({
                        prop: 'lines',
                        value: lines.push(
                          {
                            concept,
                            items,
                            amount,
                            tax
                          })
                      }))
                      dispatch(postCalculatePrice())
                      submitPost && dispatch(validatePostInvoice())
                    }}
                  >
                    <i className='bi bi-files me-1' />
                    {strings('button.duplicate')}
                  </a>
                  <a
                    className='dropdown-item text-danger cursor-pointer'
                    onClick={async (e) => {
                      index === 0 ? lines.shift() : lines.splice(index, 1)
                      await dispatch(setValuePostInvoiceData({ prop: 'lines', value: lines }))
                      dispatch(postCalculatePrice())
                      submitPost && dispatch(validatePostInvoice())
                    }}
                  >
                    <i className='bi bi-trash me-1' />
                    {strings('button.delete')}
                  </a>
                </div>
              </div>
            </div>
          </>)}
    </>
  )
}
