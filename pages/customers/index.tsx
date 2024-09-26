import { strings } from 'src/resources/locales/i18n'
import { ClientsList } from 'components/client/ClientsList'
import MainLayout from 'components/layout/MainLayout'
import { useRouter } from 'next/router'
import { useSelector } from 'src/redux/hooks'
import { EUserType } from 'src/types/enums'
import { useEffect } from 'react'
import Routing from 'src/routing'
import { IUserState } from 'src/types/user'

export default function CustomersPage () {
  const router = useRouter()
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)

  useEffect(() => {
    if (dataUser?.userType === EUserType.PAYER) router.push(Routing.users)
  }, [])

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>
                    {strings('title.client.clients')}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* <ClientsList /> */}
      </MainLayout>
    </>
  )
}
