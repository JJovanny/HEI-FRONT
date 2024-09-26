import { strings } from 'src/resources/locales/i18n'
import Loading from 'ui/Loading'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { useEffect } from 'react'
import { clearSupplierFilters, clearSuppliersData, setSupplierDataProps } from 'src/supplier/SupplierActions'
import { TableCustomers } from './TableCustomers'
import { UserFilter } from 'components/filter/UserFilter'
import { NotFound } from 'ui/NotFound'
import { PaymentSettings } from 'components/modal/PaymentSettings'
import { apiGetSupplierClients } from 'src/client/ClientActions'
import { EUserType } from 'src/types/enums'
import { containerQuickpay } from 'styles/js/globalStyles'

export const CustomersList = () => {
  const dispatch = useDispatch()
  const { clients, isLoadingGetClients, page, limit, count, filters } = useSelector(state => state.ClientReducer)

  const {dataUser } = useSelector(({ UserReducer }) => {
    const { dataUser } = UserReducer
    return {dataUser }
  })
  const { clear, filterCompanyAllowAdvance } = filters
  const { companyBranchSelected, userType } = dataUser

  useEffect(() => {
    dispatch(clearSupplierFilters())
    dispatch(clearSuppliersData())
    return () => {}
  }, [])

  useEffect(() => {
    dispatch(apiGetSupplierClients())
    return () => {}
  }, [page, clear, filterCompanyAllowAdvance, companyBranchSelected])

  const handleChangePage = (newPage) => {
    dispatch(setSupplierDataProps({ prop: 'page', value: newPage }))
  }

  const isUserFinancial = () => {
    return userType === EUserType.FINANCIAL
  }

  return (
    <>
      <main className='pt-5 pt-lg-8 bg-surface-secondary'>
      <div className='container' style={isUserFinancial() ? containerQuickpay || {} : undefined}>
          <div className='mt-n56 position-relative z-index-100'>
            <div className='card rounded shadow overflow-hidden'>
              <div className='card-body p-0'>
                {/** Tabs Contents */}
                <div className='row g-0'>
                  <div className={`${isUserFinancial() ? 'col-md-12 col-xl-12' : 'col-md-8 col-xl-9'} filters h-100 p-4 p-md-5 p-xl-7 border-end-md border-bottom border-bottom-md-0`}>
                    {/** filters */}
                    <UserFilter areSuppliers={false} />
                  </div>
                  <div className={`${isUserFinancial() ? 'col-md-12 col-xl-12' : 'col-md-8 col-xl-9'} h-100`}>
                    <div className='table-responsive'>
                      <table className='table table-hover table-nowrap'>
                        <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
                          <tr>
                            <th scope='col'>{strings('clients.company')}</th>
                            <th scope='col' className='d-lg-table-cell'>{strings('clients.contact')}</th>
                            {/* <th scope='col' className='d-lg-table-cell'>{strings('clients.city')}</th> */}
                            <th scope='col'>{strings('clients.invoices')}</th>
                            {userType === EUserType.FINANCIAL && (
                              <>
                              <th scope='col'>{strings('clients.receivableBalance')}</th>
                              <th scope='col'>{strings('clients.totalOverdue')}</th>
                              <th scope='col'>{strings('clients.totalFinanced')}</th>
                              <th scope='col'>{strings('clients.discountRate')}</th>
                              </>
                            )}
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          {!isLoadingGetClients && clients?.map((customer) =>
                            <TableCustomers
                              key={customer?.id}
                              customer={customer}
                            />)}
                        </tbody>
                      </table>
                      {clients?.length === 0 && !isLoadingGetClients && <NotFound string={strings('alert.suppliers')} />}

                      {isLoadingGetClients && <div className='d-flex justify-content-center' style={{ margin: '10px 0px', height: '20vh' }}><Loading /></div>}

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
                          {strings('placeholder.showResults', { actualResultsShowed: clients?.length, totalResults: count })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
