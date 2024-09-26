import { strings } from 'src/resources/locales/i18n'
import { ClientsList } from 'components/client/ClientsList'
import MainLayout from 'components/layout/MainLayout'

export default function UsersInvitePage () {

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>
                    Desendencia
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <ClientsList />
      </MainLayout>
    </>
  )
}
