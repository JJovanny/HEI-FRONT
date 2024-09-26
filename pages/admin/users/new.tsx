import { CreateUserCompanyForm } from 'components/admin/userCompany/CreateUserCompanyForm'
import MainLayout from 'components/layout/MainLayout'
import { strings } from 'src/resources/locales/i18n'

export default function NewUserPage () {
  return (
    <>
      <MainLayout isAdminRoute>
        <header className='pt-6 pb-56 gradient-bottom start-gray-800 end-gray-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>{strings('title.admin.createUser')}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <CreateUserCompanyForm />

      </MainLayout>
    </>
  )
}
