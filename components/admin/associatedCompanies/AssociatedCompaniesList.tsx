import { useEffect } from 'react'
import { apiGetAssociatedCompanies, clearCompaniesData } from 'src/admin/companies/CompaniesActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import Loading from 'ui/Loading'
import { NotFound } from 'ui/NotFound'
import { TableCompanyElement } from './TableCompanyElement'

export const AssociatedCompaniesList = () => {
  const dispatch = useDispatch()
  const { companies, isLoadingGetAssociatedCompanies } = useSelector(state => state.CompaniesReducer)
  const { accessToken } = useSelector(state => state.AdminUserReducer)

  useEffect(() => {
    dispatch(clearCompaniesData())
    accessToken && dispatch(apiGetAssociatedCompanies())
    return () => {}
  }, [])

  return (
    <>
      <main className='pt-5 pb-8 bg-surface-secondary'>
        <div className='container-xl pt-6'>
          <div className='mt-n56 position-relative z-index-100'>

            <div className='card rounded shadow overflow-hidden'>
              <div className='card-body p-0'>
                <div className='table-responsive'>
                  <table className='table table-hover table-nowrap'>
                    <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
                      <tr>
                        <th scope='col'>{strings('form.placeholder.companyName').toUpperCase()}</th>
                        <th scope='col'>{strings('form.placeholder.contactEmail').toUpperCase()}</th>
                        <th scope='col' className='d-xl-table-cell'>{strings('form.placeholder.externalPayment').toUpperCase()}</th>
                        <th scope='col' />
                      </tr>
                    </thead>
                    <tbody>
                      {!isLoadingGetAssociatedCompanies && companies.map((company) => <TableCompanyElement key={company.id} company={company} />)}
                    </tbody>
                  </table>
                  {isLoadingGetAssociatedCompanies && <div className='d-flex justify-content-center' style={{ margin: '10px 0px', height: '20vh' }}><Loading /></div>}
                  {companies.length === 0 && !isLoadingGetAssociatedCompanies && <NotFound string={strings('alert.admin.companies')} mb />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
