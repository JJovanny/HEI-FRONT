import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import { IClientList } from 'src/types/client'
import { apiGetClient, apiGetCompanyInvoices, apiGetCompanyInvoicesBySuppFinancial, apiGetOneSuppCustRelationship, setClientInvoiceData, setPaymentPreferences, setShowSupplier } from 'src/client/ClientActions'
import { EUserType } from 'src/types/enums'
import { useEffect } from 'react'
import { IUserState } from 'src/types/user'

type Props = {
  supplier: IClientList
}

export const TableSupplier = (props: Props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { dataUser: { userType } } = useSelector((state) => state.UserReducer as IUserState)

  const { supplier } = props
  const { id, name, contactName, contactEmail, invoices, paymentPreferences, totalAdvanced, currentAdvancedBalance, averageMonthlyAdvance, discountRate } = supplier
  const { allowPaymentInAdvance } = paymentPreferences

  const hancleRedirectClientProfile = async () => { 
    await dispatch(apiGetClient(id))
    if (userType !== EUserType.FINANCIAL) {
      await dispatch(apiGetCompanyInvoices(id, EUserType.PAYER))
      await dispatch(setShowSupplier({prop: 'showSupplier', value: true}))
    }
    if (userType === EUserType.FINANCIAL) await dispatch(apiGetCompanyInvoicesBySuppFinancial(id, EUserType.FINANCIAL))
    router.push(`${Routing.suppliersCustomers}/${id}`) 
  }

  useEffect(() => {
    dispatch(setPaymentPreferences({prop: 'paymentPreferences', value: undefined}))
    dispatch(setShowSupplier({prop: 'showSupplier', value: false}))
  },[])

  const handleGetSupplierCustomerRelationship = async () => {
    await dispatch(setPaymentPreferences({prop: 'paymentPreferences', value: undefined}))
    await dispatch(apiGetOneSuppCustRelationship(id))
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
        {userType !== EUserType.FINANCIAL && (
          <td className='text-end'>
            <button 
              onClick={handleGetSupplierCustomerRelationship} 
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
        )}
        {userType === EUserType.FINANCIAL && (
          <>
            <td onClick={() => { hancleRedirectClientProfile() }} className='d-lg-table-cell text-center'>
              <div className='text-wrap'> {currentAdvancedBalance} </div>
            </td>
            <td onClick={() => { hancleRedirectClientProfile() }} className='d-lg-table-cell text-center'>
              <div className='text-wrap'> {averageMonthlyAdvance} </div>
            </td>
            <td onClick={() => { hancleRedirectClientProfile() }} className='d-lg-table-cell text-center'>
              <div className='text-wrap'> {totalAdvanced} </div>
            </td>
            <td onClick={() => { hancleRedirectClientProfile() }} className='d-lg-table-cell text-center'>
              <div className='text-wrap'> {discountRate}% </div>
            </td>
          </>
        )}
      </tr>
    </>
  )
}
