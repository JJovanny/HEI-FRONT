import MainLayout from 'components/layout/MainLayout'
import { PayersList } from 'components/payers/PayersList'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import { EUserType } from 'src/types/enums'
import { IUserState } from 'src/types/user'

export default function PayersPage () {
  const router = useRouter()
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)

  useEffect(() => {
    if (dataUser?.userType === EUserType.SUPPLIER) router.push(Routing.users)
  }, [])

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>{strings('creditProviders.title')}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <PayersList />

      </MainLayout>
    </>
  )
}
