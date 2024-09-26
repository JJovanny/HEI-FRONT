import React, { useEffect } from 'react'
import Link from 'next/link'
import { strings } from '../../src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { EUserType } from 'src/types/enums'
import { apiGetInvoicesReceivedMetrics } from 'src/invoice/InvoiceActions'
import { formatCurrency } from 'src/utils/Utils'

export const InvoiceBillingPayerMetrics = () => {
    const { dataUser: { userType, companyBranchSelected } } = useSelector(state => state.UserReducer)

    const dispatch = useDispatch()
    const { totalDuethisMonth, earnings, totalDueAfterDeductingMonthlyEarnings } = useSelector(state => state.InvoiceReducer)
    const country = companyBranchSelected !== undefined && companyBranchSelected['country'] && typeof companyBranchSelected['country'] === 'object' ? companyBranchSelected['country']['code'] : ''    

    useEffect(() => {
        dispatch(apiGetInvoicesReceivedMetrics())
    },[])

    return (
        <>
            {(userType === EUserType.PAYER || userType === EUserType.BOTH) && (
                <main id='dashboard' className=''>
                    <div className='card rounded shadow overflow-hidden bg-light'>
                        <div className='card-body p-3 p-lg-3 p-xl-3'>
                            <div className='row g-6 mb-1'>
                                <div className='col-xl-4 col-sm-6 col-12'>
                                    <div className='card h-50'>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col text-center'>
                                                    <span className='h6 font-semibold text-muted text-sm d-block mb-2'>{strings('placeholder.totalDuethisMonth')}</span>
                                                    <span className='h1 font-bold mb-0'>{formatCurrency(country, parseFloat(parseFloat(totalDuethisMonth).toFixed(2)))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-xl-4 col-sm-6 col-12'>
                                    <div className='card h-50'>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col text-center'>
                                                    <span className='h6 font-semibold text-muted text-sm d-block mb-2'>{strings('placeholder.earnings')}</span>
                                                    <span className='h1 font-bold mb-0'>{formatCurrency(country, parseFloat(parseFloat(earnings).toFixed(2)))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-xl-4 col-sm-6 col-12'>
                                    <div className='card h-50'>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col text-center'>
                                                    <span className='h6 font-semibold text-muted text-sm d-block mb-2'>{strings('placeholder.totalDueAfterDeductingMonthlyEarnings')}</span>
                                                    <span className='h1 font-bold mb-0'>{formatCurrency(country, parseFloat(parseFloat(totalDueAfterDeductingMonthlyEarnings).toFixed(2)))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    )
}
