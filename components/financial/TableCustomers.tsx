import { useRouter } from 'next/router'
import { useDispatch, useSelector} from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import { IClientList } from 'src/types/client'
import { apiGetClient, apiGetCompanyInvoices, apiGetOneFinancialCustRelationship, apiGetOneSuppCustRelationship, setPaymentPreferences } from 'src/client/ClientActions'
import { EUserType } from 'src/types/enums'
import { useEffect } from 'react'
import { IUserState } from 'src/types/user'

type Props = {
  customer: IClientList
}

export const TableCustomers = (props: Props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { dataUser: { userType } } = useSelector((state) => state.UserReducer as IUserState)
  const { customer } = props
  const { id, name, contactName, contactEmail, invoices, paymentPreferences, discountRate, receivableBalance, totalOverdue, totalFinanced } = customer

  const hancleRedirectClientProfile = async () => {
    await dispatch(apiGetClient(id))
    await dispatch(apiGetCompanyInvoices(id, EUserType.FINANCIAL))
    router.push(`${Routing.suppliersCustomers}/${id}`) 
  }

  useEffect(() => {
    dispatch(setPaymentPreferences({prop: 'paymentPreferences', value: undefined}))
  },[])

  const handleGetFinancialCustomerRelationship = async () => {
    await dispatch(setPaymentPreferences({prop: 'paymentPreferences', value: undefined}))
    await dispatch(apiGetOneFinancialCustRelationship(id))
    document.getElementById('modal-open-payment-setting')?.click()
  }

  return (
    <>
      <tr style={{ cursor: 'pointer' }}>
        <td onClick={() => { hancleRedirectClientProfile() }}>
          <a className='text-heading font-semibold'>{name}</a>
        </td>
        <td onClick={() => { hancleRedirectClientProfile() }} className='d-lg-table-cell'>
          <div className='text-wrap'> {contactName} </div>
          <div className='text-wrap'> <a href={`mailto:${contactEmail}`}> {contactEmail} </a></div>
        </td>
        <td onClick={() => { hancleRedirectClientProfile() }}> {invoices} </td>
        {userType === EUserType.FINANCIAL && (
          <>
            <td className='text-center' onClick={() => { hancleRedirectClientProfile() }}> {receivableBalance} </td>
            <td className='text-center' onClick={() => { hancleRedirectClientProfile() }}> {totalOverdue} </td>
            <td className='text-center' onClick={() => { hancleRedirectClientProfile() }}> {totalFinanced} </td>
            <td className='text-center' onClick={() => { hancleRedirectClientProfile() }}> {discountRate}% </td>
          </>
        )}
        <td className='text-end'>

          <button 
            onClick={handleGetFinancialCustomerRelationship} 
            className='btn btn-sm btn-primary'
            >
            {strings('paymentPreferences.title')}
          </button>

          <button 
            className='d-none'
            id='modal-open-payment-setting'
            data-bs-target='#modalPaymetSettings'
            data-bs-toggle='modal'
            />
        </td>
      </tr>
    </>
  )
}
