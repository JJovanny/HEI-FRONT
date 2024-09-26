import React, { useEffect } from 'react'
import { strings } from 'src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { ICompaniesFilter } from 'src/types/filter'
import TextInput from 'ui/input/TextInput'
import { apiGetMySuppliers, clearSupplierFilters, setValueSupplierFiltersData } from 'src/supplier/SupplierActions'
import CheckboxInput from 'ui/input/CheckboxInput'
import { apiGetSupplierClients, clearClientsFilters, setValueClientFiltersData } from 'src/client/ClientActions'
import { EUserType } from 'src/types/enums'

type Props = {
    areSuppliers: boolean // true (suppliers table) or false (clients table)
}

export const UserFilter = (props: Props) => {
  const dispatch = useDispatch()
  const { areSuppliers } = props

  const {dataUser } = useSelector(({ UserReducer }) => {
    const { dataUser } = UserReducer
    return {dataUser }
  })
  const { userType } = dataUser

  const { filtersSuppliers, filtersCustomers } = useSelector(({ SupplierReducer, ClientReducer }) => {
    const filtersSuppliers: ICompaniesFilter = SupplierReducer.filters
    const filtersCustomers: ICompaniesFilter = ClientReducer.filters

    return { filtersSuppliers, filtersCustomers }
  })

  const filterCompanyNameSupplier = filtersSuppliers?.filterCompanyName || ''
  const filterCompanyContactEmailSupplier = filtersSuppliers?.filterCompanyContactEmail || ''
  const filterCompanyAllowAdvanceSupplier = filtersSuppliers?.filterCompanyAllowAdvance || false
  const filterClearSupplier = filtersSuppliers?.clear

  const filterCompanyNameClient = filtersCustomers?.filterCompanyName || ''
  const filterCompanyContactEmailClient = filtersCustomers?.filterCompanyContactEmail || ''
  const filterClearClient = filtersCustomers?.clear

  const handleClearFilters = () => {
    if (areSuppliers) {
      dispatch(clearSupplierFilters())
      dispatch(setValueSupplierFiltersData({ prop: 'clear', value: !filterClearSupplier }))
    } else {
      dispatch(clearClientsFilters())
      dispatch(setValueClientFiltersData({ prop: 'clear', value: !filterClearClient }))
    }
  }

  useEffect(() => {
    const filterCompanyName = document.getElementById('filterCompanyName')
    const filterCompanyContactEmail = document.getElementById('filterCompanyContactEmail')
    let timeoutFilterCompanyName, timeoutCompanyContactEmail

    filterCompanyName?.addEventListener('keydown', () => {
      clearTimeout(timeoutFilterCompanyName)
      timeoutFilterCompanyName = setTimeout(() => {
        !areSuppliers && dispatch(apiGetSupplierClients())
        areSuppliers && dispatch(apiGetMySuppliers())
        clearTimeout(timeoutFilterCompanyName)
      }, 1000)
    })

    filterCompanyContactEmail?.addEventListener('keydown', () => {
      clearTimeout(timeoutCompanyContactEmail)
      timeoutCompanyContactEmail = setTimeout(() => {
        !areSuppliers && dispatch(apiGetSupplierClients())
        areSuppliers && dispatch(apiGetMySuppliers())
        clearTimeout(timeoutCompanyContactEmail)
      }, 700)
    })
  }, [])

  const isUserFinancial = () => {
    return userType === EUserType.FINANCIAL
  }

  return (
    <>
      <form 
        className={`${isUserFinancial() ? 'form justify-content-start d-flex' : 'form form-filters'}`}
        style={isUserFinancial() ? {borderBottom: '1px solid #cccccc'} : undefined}
      >
        <div className={`${isUserFinancial() ? 'mb-5 me-5' : 'mb-5'}`}>
          <TextInput
            classNameInput='form-control-sm form-label'
            id='filterCompanyName'
            name='filterCompanyName'
            noValidate={false}
            otherId=''
            readOnly={false}
            placeholder={strings('filters.search')}
            textLabel={strings('filters.companyName')}
            type='text'
            value={areSuppliers ? filterCompanyNameSupplier : filterCompanyNameClient}
            onChange={async (e) => {
              if (areSuppliers) {
                await dispatch(setValueSupplierFiltersData({ prop: e.target.name, value: e.target.value }))
              } else {
                await dispatch(setValueClientFiltersData({ prop: e.target.name, value: e.target.value }))
              }
            }}
          />
        </div>
        <div className={`${isUserFinancial() ? 'mb-5 me-5' : 'mb-5'}`}>
          <TextInput
            classNameInput='form-control-sm form-label'
            id='filterCompanyContactEmail'
            name='filterCompanyContactEmail'
            noValidate={false}
            otherId=''
            readOnly={false}
            placeholder={strings('filters.search')}
            textLabel={strings('filters.companyContactEmail')}
            type='text'
            value={areSuppliers ? filterCompanyContactEmailSupplier : filterCompanyContactEmailClient}
            onChange={async (e) => {
              if (areSuppliers) {
                await dispatch(setValueSupplierFiltersData({ prop: e.target.name, value: e.target.value }))
              } else {
                await dispatch(setValueClientFiltersData({ prop: e.target.name, value: e.target.value }))
              }
            }}
          />
        </div>
        {(areSuppliers && !isUserFinancial())
          ? (
            <div className='mb-5'>
              <div className='form-check'>
                <CheckboxInput
                  classNameInput='form-check-input'
                  id='filterCompanyAllowAdvance'
                  name='filterCompanyAllowAdvance'
                  type='checkbox'
                  checked={filterCompanyAllowAdvanceSupplier || false}
                  onChange={async (e) => {
                    await dispatch(setValueSupplierFiltersData({ prop: e.target.name, value: e.target.checked }))
                  }}
                />
                <label className='form-check-label' htmlFor='filterCompanyAllowAdvance'>
                  {strings('filters.allowAdvance')}
                </label>
              </div>
            </div>)
          : <></>}
        {/** clear button */}
        {!isUserFinancial() && (
          <button
            type='button'
            id='clear-invoices-filters'
            className='btn btn-neutral text-danger border-danger'
            onClick={handleClearFilters}
          >
            {strings('button.clear')}
          </button>
        )}

        {isUserFinancial() && (
          <button
            type='button'
            id='clear-invoices-filters'
            style={{ height: "50px"}}
            className='btn btn-sm btn-neutral text-danger border-danger mt-5'
            onClick={handleClearFilters}
          >
            {strings('button.clear')}
          </button>
        )}

      </form>
    </>
  )
}
