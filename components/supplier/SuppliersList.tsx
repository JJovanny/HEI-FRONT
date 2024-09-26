import { strings } from 'src/resources/locales/i18n'
import Loading from 'ui/Loading'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { useEffect } from 'react'
import { apiGetFinancialSuppliers, apiGetMySuppliers, clearSupplierFilters, clearSuppliersData, setSupplierDataProps } from 'src/supplier/SupplierActions'
import { TableSupplier } from './TableSupplier'
import { UserFilter } from 'components/filter/UserFilter'
import { NotFound } from 'ui/NotFound'
import { PaymentSettings } from 'components/modal/PaymentSettings'
import { IUserState } from 'src/types/user'
import { EUserType } from 'src/types/enums'
import { containerQuickpay } from 'styles/js/globalStyles'
import { InviteCompanyByEmail } from 'components/modal/InviteCompanyByEmail'

export const SuppliersList = () => {
  const dispatch = useDispatch()
  const { suppliers, filters, isLoadingGetSuppliers, dataUser, page, limit, count } = useSelector(({ SupplierReducer, UserReducer }) => {
    const { suppliers, filters, isLoadingGetSuppliers, page, limit, count } = SupplierReducer
    const { dataUser } = UserReducer

    return { suppliers, filters, dataUser, isLoadingGetSuppliers, page, limit, count }
  })
  const { clear, filterCompanyAllowAdvance } = filters
  const { companyBranchSelected } = dataUser
  const { dataUser: { userType } } = useSelector((state) => state.UserReducer as IUserState)

  useEffect(() => {
    dispatch(clearSupplierFilters())
    dispatch(clearSuppliersData())
    return () => {}
  }, [])

  useEffect(() => {
    if (userType !== EUserType.FINANCIAL) dispatch(apiGetMySuppliers())
    if (userType === EUserType.FINANCIAL) dispatch(apiGetFinancialSuppliers())
    return () => {}
  }, [page, clear, filterCompanyAllowAdvance, companyBranchSelected, userType])

  const handleChangePage = (newPage) => {
    dispatch(setSupplierDataProps({ prop: 'page', value: newPage }))
  }

  const isUserFinancial = () => {
    return userType === EUserType.FINANCIAL
  }

  const isUserPayer = () => {
    return userType === EUserType.PAYER
  }

  return (
    <>
      <main className='pt-5 pt-lg-8 bg-surface-secondary'>
        <div className='container' style={isUserFinancial() ? containerQuickpay || {} : undefined}>
          <div className='mt-n56 position-relative z-index-100'>

        {isUserPayer() && (
          <div className='d-flex justify-content-end mb-3'>
            <button 
              type='button'
              data-bs-target='#inviteCompanyModal'
              data-bs-toggle='modal'
              className='btn btn-sm btn-primary d-lg-inline-flex mx-1'>
              <span className='pe-1'>
                <i className='bi bi-person-plus' />
              </span>
              <span className='d-none d-lg-inline ps-lg-1'>{strings('button.createNewSupplier')}</span>
            </button>
          </div>
        )}

            <div className='card rounded shadow overflow-hidden'>


              <div className='card-body p-0'>
                {/** Tabs Contents */}
                <div className='row g-0'>
                <div className={`${isUserFinancial() ? 'col-md-12 col-xl-12' : 'col-md-4 col-xl-3'} filters h-100 p-4 p-md-5 p-xl-7 border-end-md border-bottom border-bottom-md-0`}>
                    {/** filters */}
                    <UserFilter areSuppliers />
                  </div>
                  <div className={`${isUserFinancial() ? 'col-md-12 col-xl-12' : 'col-md-8 col-xl-9'} h-100`}>
                    <div className='table-responsive'>
                      <table className='table table-hover table-nowrap'>
                        <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
                          <tr>
                            <th scope='col'>{strings('clients.company')}</th>
                            <th scope='col' className='d-lg-table-cell'>{strings('clients.contact')}</th>
                            <th scope='col'>{strings('clients.invoices')}</th>
                            {userType !== EUserType.FINANCIAL && (
                              <th />
                            )}
                            {userType === EUserType.FINANCIAL && (
                              <>
                              <th scope='col'>{strings('clients.currentAdvancedBalance')}</th>
                              <th scope='col'>{strings('clients.averageMonthlyAdvance')}</th>
                              <th scope='col'>{strings('clients.totalAdvanced')}</th>
                              <th scope='col'>{strings('clients.discountRate')}</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {!isLoadingGetSuppliers && suppliers?.map((supplier) =>
                            <TableSupplier
                              key={supplier?.id}
                              supplier={supplier}
                            />)}
                        </tbody>
                      </table>
                      {suppliers?.length === 0 && !isLoadingGetSuppliers && <NotFound string={strings('alert.suppliers')} />}

                      {isLoadingGetSuppliers && <div className='d-flex justify-content-center' style={{ margin: '10px 0px', height: '20vh' }}><Loading /></div>}

                      <PaymentSettings />
                      <div className='py-4 text-center'>
                        <div className='card-footer border-0 py-3 text-center'>
                          {/** Previous */}
                          <a
                            onClick={() => handleChangePage(page - 1)}
                            className={page === 1
                              ? 'btn d-inline-flex btn-sm btn-neutral mx-1 disabled'
                              : 'btn d-inline-flex btn-sm btn-neutral mx-1 border-secondary'}
                          >
                            <span className='me-2'>
                              <i className='bi bi-chevron-double-left' />
                            </span>
                            <span>{strings('button.previous')}</span>
                          </a>
                          {/** Actual page */}
                          <a className='btn d-inline-flex btn-sm btn-neutral border-secondary mx-1'>
                            <span>{page}</span>
                          </a>
                          {/** Next */}
                          <a
                            onClick={() => handleChangePage(page + 1)}
                            className={page * limit >= count
                              ? 'btn d-inline-flex btn-sm btn-neutral mx-1 disabled'
                              : 'btn d-inline-flex btn-sm btn-neutral mx-1 border-secondary'}
                          >
                            <span className='me-2'>
                              <i className='bi bi-chevron-double-right' />
                            </span>
                            <span>{strings('button.next')}</span>
                          </a>
                        </div>
                        <p className='text-xs text-muted'>
                          {strings('placeholder.showResults', { actualResultsShowed: suppliers?.length, totalResults: count })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <InviteCompanyByEmail />
      </main>
    </>
  )
}
