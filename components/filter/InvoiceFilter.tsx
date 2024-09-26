import React, { useEffect, useState } from 'react'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import TextInput from 'ui/input/TextInput'
import CheckboxInput from 'ui/input/CheckboxInput'
import { clearInvoicesFilters, setValueInvoicesFiltersData } from 'src/invoice/InvoiceActions'
import SelectInput from 'ui/input/SelectInput'
import { getInvoiceStatusList } from 'src/api/utils'
import { IInvoiceState } from 'src/types/invoice'
import { IUserState } from 'src/types/user'
import { EUserType, InvoiceStatus } from 'src/types/enums'
import { useRouter } from 'next/router'

export const InvoiceFilter = ({top = false}) => {
  const dispatch = useDispatch()
  const { filters } = useSelector((state) => state.InvoiceReducer as IInvoiceState)
  const { dataUser: { userType } } = useSelector((state) => state.UserReducer as IUserState)
  const { filterInvoiceNumber, filterUserName, filterInvoiceState, filterAllowAdvance, clear } = filters
  const router = useRouter()

  const handleClearFilters = () => {
    dispatch(clearInvoicesFilters())
    dispatch(setValueInvoicesFiltersData({ prop: 'clear', value: !clear }))
  }

  useEffect(() => {
    dispatch(clearInvoicesFilters())
    dispatch(setValueInvoicesFiltersData({ prop: 'clear', value: true }))
  },[])
  
  const invoiceStatusList = getInvoiceStatusList();
  const invoiceAllStatusList = getInvoiceStatusList().filter((status) => {return status.id !== InvoiceStatus.IN_PROGRESS && status.id !== 'none'});
  const filteredStatusListInvoices = invoiceAllStatusList.filter(status => {
    if (userType === EUserType.FINANCIAL) {
      return ['PAID'].includes(status.id);
    }
    return true;
  });
  const filteredStatusList = invoiceStatusList.filter(status => {
    if (userType === EUserType.SUPPLIER || userType === EUserType.PAYER) {
      return ['ADVANCED', 'PAID', 'OVERDUE'].includes(status.id);
    }
    else if (userType === EUserType.FINANCIAL) {
      return ['PAID'].includes(status.id);
    }
    return true;
  });

  const [invoiceStatus, setInvoiceStatus] = useState(filteredStatusListInvoices)
  const [invoiceQuickpayStatus, setInvoiceQuickpayStatus] = useState(filteredStatusList)

  if (userType === EUserType.SUPPLIER || userType === EUserType.BOTH) {
    filteredStatusList.push({id: 'QUICKPAY', value: strings('invoiceStatus.inProgress')});
  }

  if (userType === EUserType.PAYER || userType === EUserType.BOTH) {
    filteredStatusList.push({id: 'ADVANCE', value: strings('invoiceStatus.advancedTwo')});
  }

  useEffect(() => {
    if (userType === EUserType.FINANCIAL && router.pathname !== '/invoices/quickpay') {
      const invoicesFinancial = filteredStatusList
      invoicesFinancial.push({id: 'QUICKPAY', value: strings('invoiceStatus.advancedTwo')});
      invoicesFinancial.push({id: 'ADVANCED', value: strings('invoiceStatus.advanced')});
      setInvoiceStatus(invoicesFinancial)
    }
  
    if (userType === EUserType.FINANCIAL && router.pathname === '/invoices/quickpay') {
      const invoicesQuickpayFinancial = filteredStatusList
      invoicesQuickpayFinancial.push({id: InvoiceStatus.ADVANCED, value: strings('invoiceStatus.toCollect')});
      invoicesQuickpayFinancial.push({id: InvoiceStatus.OVERDUE, value:  strings('invoiceStatus.overdue')});
      setInvoiceQuickpayStatus(invoicesQuickpayFinancial)
    }
  },[router.pathname])

  return (
    <>
      {top && (
        <form className='justify-content-start d-flex' style={{ borderBottom: '1px solid #cccccc'}}>
          <div className='mb-1 me-1' style={{ position: 'relative' }}>
            <TextInput
              classNameInput='form-control-sm form-label'
              id='filterInvoiceNumber'
              name='filterInvoiceNumber'
              noValidate={false}
              otherId=''
              readOnly={false}
              placeholder={strings('filters.search')}
              textLabel={strings('filters.invoiceNumber')}
              type='text'
              value={filterInvoiceNumber}
              onChange={async (e) => {
                await dispatch(setValueInvoicesFiltersData({ prop: e.target.name, value: e.target.value }))
              }}
            />
          <div onClick={handleClearFilters} style={{ position: 'absolute', top: '65%', right: '8px', transform: 'translateY(-50%)', cursor: 'pointer' }}>
            <p>x</p>
          </div>
          </div>

          <div className='mb-1 me-1' style={{ position: 'relative' }}>
            <TextInput
              classNameInput='form-control-sm form-label'
              id='filterUserName'
              name='filterUserName'
              noValidate={false}
              otherId=''
              readOnly={false}
              placeholder={strings('filters.search')}
              textLabel={strings('filters.companyUser')}
              type='text'
              value={filterUserName}
              onChange={async (e) => {
                await dispatch(setValueInvoicesFiltersData({ prop: e.target.name, value: e.target.value }))
              }}
            />
            <div onClick={handleClearFilters} style={{ position: 'absolute', top: '65%', right: '8px', transform: 'translateY(-50%)', cursor: 'pointer' }}>
            <p>x</p>
          </div>
          </div>
          <div className='mb-1 me-5'>
            <SelectInput
              classNameSelect='form-select form-select-sm form-label'
              dataChildren={invoiceQuickpayStatus}
              hasMultiple={false}
              id='filterInvoiceState'
              getItemId
              noValidate={false}
              showSelect
              strDefaultSelect={strings('filters.pleaseSelect')}
              value={filterInvoiceState || ''}
              textLabel={strings('filters.selectInvoiceStatus')}
              onChange={async (e) => {
                await dispatch(setValueInvoicesFiltersData({ prop: e.target.id, value: e.target.value }))
              }}
            />
          </div>
          <button
            type='button'
            id='clear-invoices-filters'
            style={{ height: "50px"}}
            className='btn btn-sm btn-neutral text-danger border-danger mt-5'
            onClick={handleClearFilters}
          >
            {strings('button.clear')}
          </button>
        </form>
      )}

      {!top && (
        <form className='justify-content-start d-flex' style={{ borderBottom: '1px solid #cccccc'}}>
          <div className='mb-1 me-1' style={{ position: 'relative' }}>
            <TextInput
              classNameInput='form-control-sm form-label'
              id='filterInvoiceNumber'
              name='filterInvoiceNumber'
              noValidate={false}
              otherId=''
              readOnly={false}
              placeholder={strings('filters.search')}
              textLabel={strings('filters.invoiceNumber')}
              type='text'
              value={filterInvoiceNumber}
              onChange={async (e) => {
                await dispatch(setValueInvoicesFiltersData({ prop: e.target.name, value: e.target.value }))
              }}
            />
          <div onClick={handleClearFilters} style={{ position: 'absolute', top: '65%', right: '8px', transform: 'translateY(-50%)', cursor: 'pointer' }}>
            <p>x</p>
          </div>
          </div>
          <div className='mb-1 me-1' style={{ position: 'relative' }}>
            <TextInput
              classNameInput='form-control-sm form-label'
              id='filterUserName'
              name='filterUserName'
              noValidate={false}
              otherId=''
              readOnly={false}
              placeholder={strings('filters.search')}
              textLabel={strings('filters.companyUser')}
              type='text'
              value={filterUserName}
              onChange={async (e) => {
                await dispatch(setValueInvoicesFiltersData({ prop: e.target.name, value: e.target.value }))
              }}
            />
            <div onClick={handleClearFilters} style={{ position: 'absolute', top: '65%', right: '8px', transform: 'translateY(-50%)', cursor: 'pointer' }}>
            <p>x</p>
          </div>
          </div>
          <div className='mb-1 me-5'>
            <SelectInput
              classNameSelect='form-select form-select-sm form-label'
              dataChildren={invoiceStatus}
              hasMultiple={false}
              id='filterInvoiceState'
              getItemId
              noValidate={false}
              showSelect
              strDefaultSelect={strings('filters.pleaseSelect')}
              value={filterInvoiceState || ''}
              textLabel={strings('filters.selectInvoiceStatus')}
              onChange={async (e) => {
                await dispatch(setValueInvoicesFiltersData({ prop: e.target.id, value: e.target.value }))
              }}
            />
          </div>
          <div className='mt-5 me-5'>
            <div className='form-check'>
               <CheckboxInput
                 classNameInput='form-check-input'
                 id='filterAllowAdvance'
                 name='filterAllowAdvance'
                 type='checkbox'
                 checked={filterAllowAdvance}
                 onChange={async (e) => {
                   await dispatch(setValueInvoicesFiltersData({ prop: e.target.name, value: e.target.checked }))
                 }}
               />
               <label className='form-check-label' htmlFor='filterAllowAdvance'>
                 {strings('filters.allowAdvance')}
               </label>
             </div>
          </div>
          <button
            type='button'
            id='clear-invoices-filters'
            style={{ height: "50px"}}
            className='btn btn-sm btn-neutral text-danger border-danger mt-2'
            onClick={handleClearFilters}
          >
            {strings('button.clear')}
          </button>
        </form>
      )}
    </>
  )
}
