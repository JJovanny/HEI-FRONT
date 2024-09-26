import React, { useEffect } from 'react'
import Link from 'next/link'
import { strings } from '../../src/resources/locales/i18n'
import { useDispatch, useSelector } from 'src/redux/hooks'
import { EUserType } from 'src/types/enums'
import { apiGetInvoicesQuickpaySentMetrics } from 'src/invoice/InvoiceActions'
import { formatCurrency } from 'src/utils/Utils'

export const InvoicesQuickpaySendMetricsIsSupplier = () => {
    const dispatch = useDispatch()
    const { dataUser: { userType, companyBranchSelected } } = useSelector(state => state.UserReducer)
    const { averageDaysAdvanced, currentAdvancedAmount, totalSettledEarly } = useSelector(state => state.InvoiceReducer)
    const country = companyBranchSelected !== undefined && companyBranchSelected['country'] && typeof companyBranchSelected['country'] === 'object' ? companyBranchSelected['country']['code'] : ''    


    useEffect(() => {
        dispatch(apiGetInvoicesQuickpaySentMetrics())
    },[])

    return ( 
        <>
            {(userType === EUserType.SUPPLIER || userType === EUserType.BOTH) && (
                <main id='dashboard' className=''>
                    <div className='card rounded shadow overflow-hidden bg-light'>
                        <div className='card-body p-3 p-lg-3 p-xl-3'>
                            <div className='row g-6 mb-1'>
                                <div className='col-xl-4 col-sm-6 col-12'>
                                    <div className='card h-50'>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col text-center'>
                                                    <span className='h6 font-semibold text-muted text-sm d-block mb-2'>{strings('placeholder.averageDaysAdvanced')}</span>
                                                    <span className='h1 font-bold mb-0'>{parseInt(averageDaysAdvanced)}</span>
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
                                                    <span className='h6 font-semibold text-muted text-sm d-block mb-2'>{strings('placeholder.currentAdvancedAmount')}</span>
                                                    <span className='h1 font-bold mb-0'>{formatCurrency(country, parseFloat(parseFloat(currentAdvancedAmount).toFixed(2)))}</span>
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
                                                    <span className='h6 font-semibold text-muted text-sm d-block mb-2'>{strings('placeholder.totalSettledEarly')}</span>
                                                    <span className='h1 font-bold mb-0'>{formatCurrency(country, parseFloat(parseFloat(totalSettledEarly).toFixed(2)))}</span>
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
