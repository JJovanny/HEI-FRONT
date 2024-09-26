import { UsersCompanyList } from 'components/admin/userCompany/UsersCompanyList'
import MainLayout from 'components/layout/MainLayout'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { apiGetMyUsersCompany, clearErrorPostUserCompany, clearPostUserCompanyData } from 'src/admin/userCompany/UserCompanyActions'
import { useDispatch } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import { AdminChecker } from 'src/validations/roles'

export default function UsersPage () {
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(apiGetMyUsersCompany())
  }, [])

  function redirectNewUser () {
    dispatch(clearErrorPostUserCompany())
    dispatch(clearPostUserCompanyData())
    router.push(Routing.adminNewUser)
  }

  return (
    <MainLayout isAdminRoute>
      <header className='pt-6 pb-56 gradient-bottom start-gray-800 end-gray-500 shadow border-bottom'>
        <div className='container-xl'>
          <div>
            <div className='row align-items-center'>
              <div className='col'>
                <h1 className='h2 mb-0 text-white'>{strings('title.admin.users')}</h1>
              </div>
              <AdminChecker>
                <div className='col-auto text-end'>
                  <div className='mx-n1'>
                    <button
                      type='button'
                      className='btn btn-sm btn-primary d-lg-inline-flex mx-1'
                      onClick={redirectNewUser}
                    >
                      <span className='pe-1'>
                        <i className='bi bi-person-fill-add' />
                      </span>

                      <span className='d-none d-lg-inline ps-lg-1'>{strings('button.newUser')}</span>
                    </button>
                  </div>
                </div>
              </AdminChecker>
            </div>
          </div>
        </div>
      </header>

      <UsersCompanyList />

    </MainLayout>
  )
}
