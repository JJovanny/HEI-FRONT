import { strings } from 'src/resources/locales/i18n'
import { ClientsList } from 'components/client/ClientsList'
import MainLayout from 'components/layout/MainLayout'
import ShoppingCart from 'components/shoppingCart/ShoppingCart'

export default function ShoppingCartPage () {

  return (
    <>
      <MainLayout isAdminRoute={false}>
        <header className='pt-6 gradient-bottom start-blue-800 end-blue-500 shadow border-bottom'>
          <div className='container-xl'>
            <div>
              <div className='row align-items-center'>
                <div className='col'>
                  <h1 className='h2 mb-0 text-white'>
                     Productos
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

      <ShoppingCart />
        
      </MainLayout>
    </>
  )
}
