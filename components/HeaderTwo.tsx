import Link from 'next/link'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import AsyncImage from 'ui/image/AsyncImage'

export const HeaderTwo = () => {
  return (
    <nav className="navbar navbar-light bg-light navbar-custom">
    <div className="container-fluid">
      <div className='justify-content-start d-flex align-items-center mb-4'>
        <a className="navbar-brand">
          <Link href={Routing.login} className='d-none d-lg-block'>
            <AsyncImage
              alt={strings('imageAlt.quickPayLogo')}
              source='/images/ehi.png'
              widthImg='60'
              heightImg='10'
              styleContainer='h-10'
            />
          </Link>
        </a>
        <h3 className='ms-2 mt-4 text-2693ff'>Eco Healthy Internacional</h3>
      </div>
    </div>
  </nav>
  )
}
