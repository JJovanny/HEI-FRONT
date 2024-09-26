import { useRouter } from 'next/navigation'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import { useDispatch } from 'src/redux/hooks'
import { ICompanyAdmin } from 'src/types/admin/company'
import { setAssociatedCompaniesDataProps } from 'src/admin/companies/CompaniesActions'

export const TableCompanyElement = ({ company } : {company: ICompanyAdmin}) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { name, externalPayment, contactEmail, id } = company

  const handleManageClick = async () => {
    await dispatch(setAssociatedCompaniesDataProps({ prop: 'companyData', value: company }))
    router.push(`${Routing.adminAssociatedCompanies}/${id}`)
  }

  return (
    <>
      <tr key={id}>
        <td>
          <a className='text-heading font-semibold' style={{ cursor: 'pointer' }} onClick={handleManageClick}>{name}</a>
        </td>
        <td> <a href={`mailto:${contactEmail}`}> {contactEmail} </a></td>
        <td className='d-xl-table-cell'>
          <span className='badge badge-lg badge-dot'>
            <i className={externalPayment ? 'bg-success' : 'bg-danger'} />
            <span className='d-none d-lg-table-cell'>{externalPayment ? strings('button.yes') : strings('button.no')}</span>
          </span>
        </td>
        <td className='text-end'>
          <a
            type='button'
            className='text-tertiary font-semibold stretched-link'
            onClick={handleManageClick}
          >{strings('button.viewInvoices')}
          </a>
        </td>
      </tr>
    </>
  )
}
