import React, { useEffect } from 'react'
import Link from 'next/link'
import { strings } from '../../src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { EUserType } from 'src/types/enums'
import { apiGetInvoicesQuickpayReceivedMetrics } from 'src/invoice/InvoiceActions'
import { cardsMetrics } from 'styles/js/globalStyles'
import { formatCurrency } from 'src/utils/Utils'

export const InvoicesQuickpayReceivedMetricsIsPayer = () => {
    const dispatch = useDispatch()
    const { dataUser: { userType, companyBranchSelected } } = useSelector(state => state.UserReducer)
    const { totalSettledEarly, totalEarningsfromEarlyPayments, totalSettledEarlybyFinancialInstitution, totalEarningsfromEarlySettlementbyFinancialInstitution} = useSelector(state => state.InvoiceReducer)
    const country = companyBranchSelected !== undefined && companyBranchSelected['country'] && typeof companyBranchSelected['country'] === 'object' ? companyBranchSelected['country']['code'] : ''    

    useEffect(() => {
        dispatch(apiGetInvoicesQuickpayReceivedMetrics())
    },[])
    return (
        <>
            {(userType === EUserType.PAYER || userType === EUserType.BOTH) && (
                <main id='dashboard' className=''>
                    <div className='card rounded shadow overflow-hidden bg-light'>
                        <div className='card-body p-3 p-lg-3 p-xl-3'>
                            <div className='row g-6 mb-1'>
                                <div className='col-xl-3 col-sm-6 col-12'>
                                    <div className='card' style={cardsMetrics}>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col text-center'>
                                                    <span className='h6 font-semibold text-muted text-sm d-block mb-2'>{strings('placeholder.totalSettledEarly')}</span>
                                                    <span className='h1 font-bold mb-0'>{formatCurrency(country, parseFloat(totalSettledEarly))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-xl-3 col-sm-6 col-12'>
                                    <div className='card' style={cardsMetrics}>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col text-center'>
                                                    <span className='h6 font-semibold text-muted text-sm d-block mb-2'>{strings('placeholder.totalEarningsfromEarlyPayments')}&nbsp;({strings('placeholder.internal')})</span>
                                                    <span className='h1 font-bold mb-0'>{formatCurrency(country, parseFloat(totalEarningsfromEarlyPayments))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-xl-3 col-sm-6 col-12'>
                                    <div className='card' style={cardsMetrics}>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col text-center'>
                                                    <span className='font-semibold text-muted text-sm d-block mb-2'>{strings('placeholder.totalSettledEarlybyFinancialInstitution')}</span>
                                                    <span className='h1 font-bold mb-0'>{formatCurrency(country, parseFloat(totalSettledEarlybyFinancialInstitution))}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-xl-3 col-sm-6 col-12'>
                                    <div className='card' style={cardsMetrics}>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col text-center'>
                                                    <span className='h6 font-semibold text-muted text-sm d-block mb-2'>{strings('placeholder.totalEarningsfromEarlySettlementbyFinancialInstitution')}&nbsp;({strings('placeholder.financial')})</span>
                                                    <span className='h1 font-bold mb-0'>{formatCurrency(country, parseFloat(totalEarningsfromEarlySettlementbyFinancialInstitution))}</span>
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
