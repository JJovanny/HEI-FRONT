import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import AsyncImage from 'ui/image/AsyncImage'
import { NavLink } from './NavLink'
import { apiGetClient, apiGetCompanyInvoicesByCustFinancial, apiGetOneCustFinancialRelationship, apiGetOneFinancialCustRelationship, apiGetOneSuppCustRelationship, clearClientData, clearClientsData, setClientDataProps, setClientInvoiceData, setPaymentPreferences } from 'src/client/ClientActions'
import { clearInvoiceToInitialState } from 'src/invoice/InvoiceActions'
import { apiGetTaxes } from 'src/tax/TaxActions'
import { apiGetUserMe, apiPostExternalPayment, setUserCompanyBranchSelected, setUserLogout, setValuePutDataUser } from 'src/user/UserActions'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { apiGetCountries } from 'src/country/CountryActions'
import { apiGetAdminUser, setAdminUserLogout } from 'src/admin/user/AdminUserActions'
import { EUserType } from 'src/types/enums'
import { apiGetMyUsersCompany } from 'src/admin/userCompany/UserCompanyActions'
import { ICompanyBranch } from 'src/types/client'
import { IsNotAdminChecker } from 'src/validations/roles'
import { containerQuickpay } from 'styles/js/globalStyles'
import NotificationBar from './Notification'
import { IInvoiceState } from 'src/types/invoice'
import { setLocale } from 'src/resources/locales/i18n'
import detectBrowserLanguage from 'detect-browser-language'
import { getUserTypes } from 'src/api/utils'

const links = [
  {
    label: strings('dashboard.title'),
    route: Routing.dashboard
  }, {
    label: 'Descendencia',
    route: Routing.users
  },
  {
    label: 'Carrito de compras',
    route: Routing.shoppingCart
  },
  {
    label: 'Compras',
    route: Routing.customers
  }
]

const adminLinkAssociatedCompanies = [
  {
    label: strings('title.admin.invoices'),
    route: Routing.adminInvoices
  },
  {
    label: strings('title.admin.associatedCompanies'),
    route: Routing.adminAssociatedCompanies
  },
  {
    label: strings('title.admin.users'),
    route: Routing.adminUsers
  }
]

const adminLinkOnboardingProfiles = [
  {
    label: strings('title.admin.products'),
    route: Routing.adminOnboardingProfiles
  },
  {
    label: strings('title.admin.users'),
    route: Routing.adminUsers
  }

]

export const Navigation = ({ isAdminRoute }: { isAdminRoute: boolean }) => {
  const [showUserDropdown, setshowUserDropdown] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const { dataUser: { externalPayment, userType, id, companyBranchSelected, companyBranchs, companyBranchSelectedId } } = useSelector(state => state.UserReducer) as any
  const { userData, accessToken } = useSelector(state => state.AdminUserReducer)
  const { financial, showSupplier, client } = useSelector(state => state.ClientReducer)  
  const [companyBranchName, setCompanyBranchName] = useState(null)
  const [companyBranchsList, setCompanyBranchsList] = useState<ICompanyBranch[]>([])
  const { invoices } = useSelector((state) => state.InvoiceReducer as IInvoiceState)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || detectBrowserLanguage();
  });
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    // { code: 'pt', label: 'Português' }
  ];
 

  useEffect(() => {
    setLocale(language.substring(0, 2));
  }, [language]);
  
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setLocale(lang); 
    localStorage.setItem('language', lang); 
    window.location.reload(); 
  };

  useEffect(() => {
    if (userType === EUserType.PAYER || userType === EUserType.BOTH) {
      dispatch(apiGetOneCustFinancialRelationship())
    }
  }, [companyBranchSelected])

  useEffect(() => {
    isAdminRoute && accessToken && dispatch(apiGetAdminUser())
    !isAdminRoute && accessToken && dispatch(apiGetUserMe())
  }, [])



  const getLinks = () => {
    if (isAdminRoute) {
      return userData?.financialCompany ? adminLinkAssociatedCompanies : adminLinkOnboardingProfiles
    }

    return links
  }

  const handleClickLink = (route) => {
    if (route === Routing.customers) {
      dispatch(setClientDataProps({ prop: 'page', value: 1 }))
    }

    if (route === Routing.adminUsers) {
      dispatch(apiGetMyUsersCompany())
    }

    if (route === Routing.taxes) dispatch(apiGetTaxes())
    router.push(route)
  }

  const handleClickProfile = async () => {
    await dispatch(apiGetUserMe())
    await dispatch(clearClientsData())
    router.push(Routing.profile)
  }

  const handleShowBillig = async () => {

    if (userType === EUserType.BOTH || EUserType.PAYER) router.push(Routing.payersBilling)
    if (userType === EUserType.FINANCIAL) router.push(Routing.financialBilling)
  }

  const handleClickProfileAdmin = async () => {
    dispatch(apiGetAdminUser())
    router.push(Routing.adminProfile)
  }

  const handleSelectedCompanyBranch = async (companyId: string) => {
    await dispatch(setUserCompanyBranchSelected({ prop: 'companyBranchSelectedId', value: companyId }))
  }


  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLocale(savedLanguage);
      setLanguage(savedLanguage);
    } else {
      const browserLanguage = detectBrowserLanguage();
      setLocale(browserLanguage);
      setLanguage(browserLanguage);
    }
  }, []);

  return (
    <nav className={
      isAdminRoute
        ? 'navbar navbar-expand-lg navbar-dark gradient-bottom start-gray-900 end-gray-800 px-0 pt-4 pb-2'
        : 'navbar navbar-expand-lg navbar-dark gradient-bottom start-blue-900 end-blue-800 px-0 pt-4 pb-2'
    }
    >
      <div
        className='container'
        style={containerQuickpay}
      >
        <button className='navbar-toggler ms-n2 bg-transparent' type='button' data-bs-toggle='collapse' data-bs-target='#navbarCollapse' aria-controls='navbarCollapse' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon' />
        </button>
        <Link className='navbar-brand' href={isAdminRoute ? Routing.adminOnboardingProfiles : Routing.users}>
          <AsyncImage
            alt="ehi"
            source='/images/ehi.png'
            widthImg='50'
            heightImg='100'
            styleContainer='h-10'
            donShowLoading
          /> 
        </Link>
        <h3 className='ms-2 text-white'>E H I</h3>


        <div className="dropdown order-lg-3 ms-lg-4">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="languageDropdown"
            aria-expanded="false"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className='bi bi-three-dots-vertical' />
            {language.toUpperCase()}
          </button>
          {isOpen && (
            <ul className="dropdown-menu show" aria-labelledby="languageDropdown">
              {languages.map((lang) => (
                <li key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
                  <a className="dropdown-item" href="#">
                    <input type="radio" className='me-2' name="language" value={lang.code} checked={language === lang.code} readOnly />
                    {lang.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>


        <h5 className='text-white ms-2'>| {userType}</h5>

        <IsNotAdminChecker>
          {(Array.isArray(companyBranchsList) && companyBranchsList.length !== 0) && (
            <div className='dropdown order order-lg-3 ms-lg-4'>
              <a
                className={showUserDropdown ? 'd-block text-white show' : 'd-block text-white'}
                href='#'
                role='button'
                data-bs-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded={showUserDropdown}
                onClick={(e) => setshowUserDropdown(!showUserDropdown)}
              >
                <i className='bi bi-caret-down me-2' />
                {companyBranchName}
              </a>
              <div className='dropdown-menu dropdown-menu-end'>
                {companyBranchsList.map((companyBranch, index) => (
                  <a
                    key={index}
                    role='button'
                    href='#'
                    className='dropdown-item'
                    onClick={(e) => { handleSelectedCompanyBranch(companyBranch?.id) }}
                    style={{ cursor: 'pointer' }}
                  >
                    <i className='bi bi-building me-2' />
                    <span>{companyBranch ? companyBranch?.name : ''}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </IsNotAdminChecker>

        <div className='dropdown order order-lg-3 ms-lg-4'>
          <a
            className={showUserDropdown ? 'd-block text-white show' : 'd-block text-white'}
            href='#'
            role='button'
            data-bs-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded={showUserDropdown}
            onClick={(e) => setshowUserDropdown(!showUserDropdown)}
          >
            <i className='bi bi-person h2 text-white' />
          </a>
          <div className='dropdown-menu dropdown-menu-end'>
            {isAdminRoute
              ? (
                <>
                  <button onClick={handleClickProfileAdmin} className='dropdown-item'>
                    <i className='bi bi-sliders me-2' />
                    <span>{strings('button.account')}</span>
                  </button>
                  <div className='dropdown-divider' />
                </>
              )
              : (
                <>
                  <button onClick={handleClickProfile} className='dropdown-item'>
                    <i className='bi bi-sliders me-2' />
                    <span>{strings('button.account')}</span>
                  </button>
                  
                  <div className='dropdown-divider' />
                </>
              )}
            <a
              href={Routing.login}
              onClick={(e) => {
                dispatch(setUserLogout())
                dispatch(setAdminUserLogout())
              }}
              className='dropdown-item'
            >
              <i className='bi bi-box-arrow-left me-2' />
              <span>{strings('button.logout')}</span>
            </a>
          </div>
        </div>
        <div className='collapse navbar-collapse' id='navbarCollapse'>
          <div className='navbar-nav mb-lg-0 mt-lg-1 ms-lg-16'>
            {getLinks().map(({ label, route }) => (
              <NavLink
                href={route}
                exact
                key={route}
                className='nav-item nav-link rounded-pill py-2'
                aria-current='page'
                onClick={async () => {
                  if (label === 'Credit providers' || label === 'Financiera' || label === 'Financeira') {
                    if ((userType === EUserType.PAYER || userType === EUserType.BOTH) && (financial !== undefined && Object.keys(financial).length !== 0 && financial !== '' && financial !== null)) {
                      await dispatch(apiGetClient(financial?.id))
                      await dispatch(apiGetCompanyInvoicesByCustFinancial(financial?.id))
                    }
                  } else {
                    handleClickLink(route)
                    await dispatch(setClientInvoiceData({ prop: 'invoicesList', value: [] }))
                    await dispatch(clearClientData())
                  }
                }}
              >{label}
              </NavLink>
            ))}
          </div>
          {isAdminRoute
            ? <></>
            : (
              <>
                <div className='navbar-nav align-items-lg-center d-none_ d-lg-flex ms-lg-auto me-lg-8'>
                  {/* <div className='form-check form-switch ps-0 d-flex align-items-center justify-content-start text-sm gap-4'>
                    <div className='opacity-100 text-white'>{strings('switch.internal')}</div>
                    <input
                      className='form-check-input m-0'
                      type='checkbox'
                      role='switch'
                      id='switchPayer'
                      checked={externalPayment}
                      onClick={handleSwitch}
                    />
                    <div className='opacity-100 text-white'>{strings('switch.external')}</div>
                  </div> */}
                  <a href='#' className='nav-link nav-link-icon px-3 position-relative text-white d-none'>
                    <i className='bi bi-bell h3 text-white' />
                    <span className='w-2 h-2 bg-tertiary rounded-circle position-absolute top-3 end-2 d-inline-block' />
                  </a>
                </div>
              </>)}
          {/** Right navigation / Notifications */}
          {/* <IsNotAdminChecker>
            <div className='navbar-nav align-items-lg-center d-none d-lg-flex ms-lg-auto'>
              <NotificationBar />
            </div>
          </IsNotAdminChecker> */}
        </div>
      </div>
    </nav>
  )
}
