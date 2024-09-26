import { useEffect } from 'react'
import { apiGetMyUsersCompany } from 'src/admin/userCompany/UserCompanyActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import Loading from 'ui/Loading'
import { NotFound } from 'ui/NotFound'
import { TableUsersCompanyElement } from './TableUsersCompanyElement'
import { IUserCompanyState } from 'src/types/admin/userCompany'
import { AdminChecker } from 'src/validations/roles'
import { setAdminUserDataProps } from 'src/admin/user/AdminUserActions'

export const UsersCompanyList = () => {
  const dispatch = useDispatch()
  const { accessToken, page, limit, count  } = useSelector(state => state.AdminUserReducer)
  const { myUsersCompany, isLoadingGetMyUsersCompany } = useSelector((state) => state.UserCompanyReducer as IUserCompanyState)

  useEffect(() => {
    accessToken && dispatch(apiGetMyUsersCompany())
    return () => {}
  }, [page])

  const handleChangePage = (newPage) => {
    dispatch(setAdminUserDataProps({ prop: 'page', value: Number(newPage) || 1 }))
  } 

  return (
    <>
      <main className='pt-5 pt-lg-8 bg-surface-secondary'>
        <div className='container-xl pt-6'>
          <div className='mt-n56 position-relative z-index-100'>

            <div className='card rounded shadow overflow-hidden'>
              <div className='card-body p-0'>

                <div className='table-responsive'>
                  <table className='table table-hover table-nowrap'>
                    <thead className='gradient-top start-blue-100 end-gray-100 table-light'>
                      <tr>
                        <th scope='col'>{strings('form.placeholder.name').toUpperCase()}</th>
                        <th scope='col'>{strings('placeholder.email2').toUpperCase()}</th>
                        <AdminChecker>
                          <th scope='col' />
                        </AdminChecker>
                      </tr>
                    </thead>
                    <tbody>
                      {!isLoadingGetMyUsersCompany && myUsersCompany.map((onboardingProfile) =>
                        <TableUsersCompanyElement
                          key={onboardingProfile.id}
                          userCompany={onboardingProfile}
                        />)}
                    </tbody>
                  </table>
                  {isLoadingGetMyUsersCompany && <div className='d-flex justify-content-center' style={{ margin: '10px 0px', height: '20vh' }}><Loading /></div>}
                  {myUsersCompany.length === 0 && !isLoadingGetMyUsersCompany && <NotFound string={strings('alert.admin.users')} mb />}
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
                        <button
                          onClick={() => handleChangePage(page + 1)}
                          disabled={count === 0}
                          className={count === 0
                            ? 'btn d-inline-flex btn-sm btn-neutral mx-1 disabled'
                            : 'btn d-inline-flex btn-sm btn-neutral mx-1 border-secondary'}
                        >
                          <span className='me-2'>
                            <i className='bi bi-chevron-double-right' />
                          </span>
                          <span>{strings('button.next')}</span>
                        </button>
                      </div>
                      <p className='text-xs text-muted'>
                        {strings('placeholder.showResults', { actualResultsShowed: myUsersCompany?.length, totalResults: count })}
                      </p>
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
