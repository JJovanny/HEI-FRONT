import { strings } from 'src/resources/locales/i18n'
import { UserForm } from 'components/form/UserForm'
import MainLayout from 'components/layout/MainLayout'
import { useSelector } from 'src/redux/hooks'
import { useRouter } from 'next/navigation'
import Routing from 'src/routing'
import { IUserState } from 'src/types/user'
import { useEffect } from 'react'
import { EUserType } from 'src/types/enums'

export default function EditSupplierPage () {
  const router = useRouter()
  const { dataUser } = useSelector(state => state.UserReducer as IUserState)
  const { supplier } = useSelector(({ SupplierReducer }) => {
    const { supplier } = SupplierReducer
    return { supplier }
  })

  useEffect(() => {
    if (dataUser?.userType === EUserType.SUPPLIER) router.push(Routing.dashboard)
    !supplier?.id && router.push(Routing.dashboard)
  }, [])

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 pb-56 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  {/* <!-- Title --> */}
                  <h1 className='h2 mb-0 text-white'>{strings('title.supplier.editSupplier')}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <UserForm isSupplier user={supplier} />
      </MainLayout>
    </>
  )
}
